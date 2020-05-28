import { Request, Response } from 'express';
import { appLogger } from '../config/constants';

export class UserValidator {
    public static checkFields(req: Request, res: Response, next: Function): void {
        let data = req.body;
        if (data.name == undefined) {
            appLogger.debug('Create User', '2', 'Name missing');
            res.status(400).json({
                err: {
                    code: '0x0b',
                    message: 'Cannot create Entity due to data incompleteness'
                }
            });
        } else {
            if (data.email == undefined) {
                appLogger.debug('Create User', '2', 'e-mail missing');
                res.status(400).json({
                    err: {
                        code: '0x0b',
                        message: 'Cannot create Entity due to data incompleteness'
                    }
                });
            } else {
                if (data.password == undefined) {
                    appLogger.debug('Create User', '2', 'Password missing');
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

    public static verifyOwnership(req: Request, res: Response, next: Function): void {
        
    }
}