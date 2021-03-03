/********************************************
 *
 *	@file:			authController
 *	@module:		controllers
 *
 *	@author:		Javier Mauricio Contreras Guzman
 *
 *	@description:	Authentication controllers
 *                      - login:            Returns session object which is meant to be saved by the application client
 *                      - logout:           Removes session object from system's database
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

        let searchCondition: {email?: string, name?: string} = {};

        if(String(data.name).includes('@')) {
            searchCondition.email = data.name;
        } else {
            searchCondition.name = data.name;
        }

        DB.Models.User.findOne(searchCondition, (err, userDB) => {
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
                        message: 'Usuario o contraseña incorrectos'
                    }
                });
            }

            if (!userDB.status) {
                appLogger.warning('Authentication', 'User not verified');
                return res.status(400).json({
                    err: {
                        message: 'El usuario no ha sido verificado. Active su usuario mediante el correo electrónico'
                    }
                });
            }

            appLogger.verbose('Authentication', 'User verified');
            if (!PasswordHaher.verifyPassword(userDB.password, data.password)) {
                appLogger.warning('Authentication', 'Access denied');
                return res.status(403).json({
                    err: {
                        message: 'Usuario o contraseña incorrectos'
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
                        message: 'Usuario no encontrado'
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
                            message: 'Usuario no encontrado'
                        }
                    });
                }

                appLogger.verbose('Authentication', 'User logged out');
                res.json({
                    message: 'Sesión finalizada'
                });
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
                        message: 'Usuario no encontrado'
                    }
                });
            }

            appLogger.verbose('Authentication', 'User has been activated');
            res.status(301).redirect(`${HOST_URL}`);
        });
    }
}
