/********************************************
 *
 *	@file:			userValidator.ts
 *  @module         middlewares
 * 
 *	@author:		Javier Mauricio Contreras Guzman
 *
 *	@description:	This class middleware validates user related operations
 *                      - checkFields:                  verifies fields at creation
 *                      - validateFirstAdminCreation:   verifies admin user creation
 *
 *******************************************/


import { Request, Response } from 'express';
import { appLogger } from '../../config/constants';
import { DB } from '../../interfaces/dbManager';

export class UserValidator {
    public static checkFields(req: Request, res: Response, next: Function): void {
        let data = req.body;
        appLogger.verbose('Middleware(UserValidator)', 'Running middleware(checkFields)');
        if (data.name == undefined) {
            appLogger.warning('Check user\'s fields', `Name missing`);
            res.status(400).json({
                err: {
                    message: 'Cannot create Entity due to data incompleteness'
                }
            });
        } else {
            if (data.email == undefined) {
                appLogger.warning('Check user\'s fields', `E-mail missing`);
                res.status(400).json({
                    err: {
                        message: 'Cannot create Entity due to data incompleteness'
                    }
                });
            } else {
                if (data.password == undefined) {
                    appLogger.warning('Check user\'s fields', `Password missing`);
                    res.status(400).json({
                        err: {
                            message: 'Cannot create Entity due to data incompleteness'
                        }
                    });
                } else {
                    next();
                }
            }
        }
    }

    public static validateFirstAdminCreation(req: Request, res: Response, next: Function): void {
        let data = req.body;
        appLogger.verbose('Middleware(UserValidator)', 'Running middleware(validateFirstAdminCreation)');
        if (data.role == undefined) {
            next();
        } else {
            if (data.role == 'Admin') {
                appLogger.verbose('Middleware(UserValidator)', 'Attempt to create Admin user');
                DB.Models.User.findOne({ role: 'Admin' }, (err, availableAdmin) => {
                    if (err) {
                        appLogger.error('Middleware(UserValidator)', JSON.stringify(err));
                        res.status(500).json({
                            err: {
                                message: err
                            }
                        });
                    } else {
                        if (availableAdmin == undefined) {
                            appLogger.verbose('Create ADMIN user', 'Creating Admin user');
                            next();
                        } else {
                            appLogger.warning('Create ADMIN user', 'Admin user already exists');
                            res.status(400).json({
                                err: {
                                    message: 'There is already an Admin'
                                }
                            });
                        }
                    }
                });
            } else {
                if (data.role == 'User') {
                    appLogger.verbose('Middleware(UserValidator)', 'Attempt to create User');
                    next();
                } else {
                    appLogger.warning('Middleware(UserValidator)', 'Data incompleteness');
                    res.status(400).json({
                        err: {
                            message: 'Cannot create Entity due to incorrect data (Allowed roles: [\'Admin\', \'User\'])'
                        }
                    });
                }
            }
        }
    }
}