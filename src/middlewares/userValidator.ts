import { Request, Response } from 'express';
import { appLogger } from '../config/constants';
import { DB } from '../interfaces/dbManager';

export class UserValidator {
    public static checkFields(req: Request, res: Response, next: Function): void {
        let data = req.body;
        if (data.name == undefined) {
            appLogger.debug('CRUD User (Create)', '2', 'Name missing');
            res.status(400).json({
                err: {
                    code: '0x0b',
                    message: 'Cannot create Entity due to data incompleteness'
                }
            });
        } else {
            if (data.email == undefined) {
                appLogger.debug('CRUD User (Create)', '2', 'e-mail missing');
                res.status(400).json({
                    err: {
                        code: '0x0b',
                        message: 'Cannot create Entity due to data incompleteness'
                    }
                });
            } else {
                if (data.password == undefined) {
                    appLogger.debug('CRUD User (Create)', '2', 'Password missing');
                    res.status(400).json({
                        err: {
                            code: '0x0b',
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
        if (data.role == undefined) {
            next();
        } else {
            if (data.role == 'Admin') {
                DB.Models.User.findOne({ role: 'Admin' }, (err, availableAdmin) => {
                    if (err) {
                        res.status(500).json({
                            err: {
                                errorCode: '0x0d',
                                message: err
                            }
                        });
                    } else {
                        if (availableAdmin == undefined) {
                            next();
                            appLogger.debug('CRUD User (Create)', '2', 'Admin user created');
                        } else {
                            appLogger.debug('CRUD User (Create)', '2', 'Admin user already exists');
                            res.status(400).json({
                                err: {
                                    errorCode: '0x0c',
                                    message: 'There is already an Admin'
                                }
                            });
                        }
                    }
                });
            } else {
                if (data.role == 'User') {
                    next();
                } else {
                    res.status(400).json({
                        err: {
                            errorCode: '0x10',
                            message: 'Cannot create Entity due to incorrect data (Allowed roles: [\'Admin\', \'User\'])'
                        }
                    });
                }
            }
        }
    }

    public static verifyOwnership(req: Request, res: Response, next: Function): void {
        
    }
}