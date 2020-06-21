/********************************************
 *
 *	@file:			authController
 *	@module:		controllers
 *
 *	@author:		Javier Mauricio Contreras Guzman
 *
 *	@description:	Authentication controllers
 *                      - login:            Returns session object which is meant to be saved insive browser
 *                      - logout:           Removes session object from system
 *                      - activateUser      Activates user's account to use the system
 *
 *******************************************/

import { Request, Response } from 'express';
import _ = require('underscore');
import { appLogger, HOST_URL } from '../../config/constants';
import Authentication from '../middlewares/authentication';
import { DB } from '../../interfaces/dbManager';
import { PasswordHaher } from '../../middlewares/security/passwordHashing';


export class AuthController {
    public static login(req: Request, res: Response): void {
        let data = _.pick(req.body, ['name', 'password', 'platform', 'keepSession']);

        DB.Models.User.findOne({ name: data.name }, (err, userDB) => {
            if (err) {
                appLogger.error('Authentication', JSON.stringify(err));
                return res.status(500).json({
                    err
                });
            }
            if (userDB === null) {
                appLogger.warning('Authentication', 'No such user');
                return res.status(400).json({
                    err: {
                        message: 'Incorrect username or password'
                    }
                });
            }

            if (!userDB.status) {
                appLogger.warning('Authentication', 'User not verified');
                return res.status(400).json({
                    err: {
                        message: 'User not verified'
                    }
                })
            }

            appLogger.verbose('Authentication', 'User verified');
            if (!PasswordHaher.verifyPassword(userDB.password, data.password)) {
                appLogger.warning('Authentication', 'Access denied');
                return res.status(403).json({
                    err: {
                        message: 'Incorrect username or password'
                    }
                });
            }

            let session = Authentication.createSessionObject(userDB.id, data.platform);

            let openSessions = userDB.openSessions;
            openSessions.push({...session, keep: data.keepSession});

            DB.Models.User.findByIdAndUpdate(userDB.id, {openSessions}, (err, sessionedUser) => {
                if(err) {
                    appLogger.error('Authentication', JSON.stringify(err));
                    return res.status(500).json({
                        err
                    });
                }

                appLogger.verbose('Authentication', 'User logged in');
                res.json({
                    session: session.session,
                    userID: sessionedUser.id
                });
            });
        });
    }

    public static logout(req: Request, res: Response): void {
        let id = String(req.query.user);
        let session = String(req.query.session);

        DB.Models.User.findById(id, (err, userDB) => {
            if(err) {
                appLogger.error('Authentication', JSON.stringify(err));
                return res.status(500).json({
                    err
                });
            }
            if(userDB === null) {
                appLogger.warning('Authentication', 'No such user');
                return res.status(404).json({
                    err: {
                        message: 'No such user'
                    }
                });
            }

            let openSessions = userDB.openSessions;

            openSessions = openSessions.filter( value => {
                return value.session != session;
            });

            DB.Models.User.findByIdAndUpdate(id, {openSessions}, (err, closedUser) => {
                if(err) {
                    appLogger.error('Authentication', JSON.stringify(err));
                    return res.status(500).json({
                        err
                    });
                }

                if(closedUser === null) {
                    appLogger.warning('Authentication', 'No such user');
                    return res.status(404).json({
                        err: {
                            message: 'No such user'
                        }
                    });
                }

                appLogger.verbose('Authentication', 'User logged out');
                res.redirect(`${HOST_URL}/signin`);
            });
        });
    }

    public static activateUser(req: Request, res: Response): void {
        let id = String(req.query.id);

        DB.Models.User.findByIdAndUpdate(id, {status: true}, (err, activatedUser) => {
            if(err) {
                appLogger.error('Authentication', JSON.stringify(err));
                return res.status(500).json({
                    err
                });
            }

            if(activatedUser === null) {
                appLogger.warning('Authentication', 'No such user');
                return res.status(404).json({
                    err: {
                        message: 'No such user'
                    }
                });
            }

            appLogger.verbose('Authentication', 'User has been activated');
            res.redirect(`${HOST_URL}/signin`);
        });
    }
}
