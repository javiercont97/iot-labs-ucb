import { Request, Response } from 'express';
import { DB } from '../../interfaces/dbManager';
import { Types } from 'mongoose';
import { appLogger } from '../../config/constants';
import { resolve as resolvePath } from 'path';

class Authorization {
    public static verifyAccountOwnership(req: Request, res: Response, next: Function): void {
        appLogger.verbose('Middleware(Authorization)', 'Verify user account ownership');
        let owner = String(req.query.user);
        let userID = String(req.params.id);

        DB.Models.User.findById(owner, (err, userDB) => {
            if (err) {
                appLogger.error('Middleware(Authorization)', JSON.stringify(err));
                return res.status(500).json({
                    err: {
                        message: err
                    }
                });
            }

            if (userDB == null) {
                appLogger.warning('Middleware(Authorization)', 'User not found');
                return res.status(404).json({
                    err: {
                        message: 'User not found'
                    }
                });
            }

            // admin allowed
            if (userDB.role == 'Admin') {
                appLogger.verbose('Middleware(Authorization)', 'Admin verified');
                return next();
            }

            if (owner != userID) {
                appLogger.warning('Middleware(Authorization)', 'Acess denied');
                return res.status(403).json({
                    err: {
                        message: 'Acess denied'
                    }
                });
            }

            appLogger.verbose('Middleware(Authorization)', 'Account ownership verified');
            next();
        });
    }

    public static verifyDeviceOwnership(req: Request, res: Response, next: Function): void {
        appLogger.verbose('Middleware(Authorization)', 'Verify device ownership');
        let owner = String(req.query.user);
        let deviceID = String(req.params.id);

        DB.Models.User.findById(owner, (err, ownerUser) => {
            if (err) {
                appLogger.error('Middleware(Authorization)', JSON.stringify(err));
                return res.status(500).json({
                    err: {
                        message: err
                    }
                });
            }

            if (ownerUser == null) {
                appLogger.warning('Middleware(Authorization)', 'User not found');
                return res.status(404).json({
                    err: {
                        message: 'User not found'
                    }
                });
            }

            // admin allowed
            if (ownerUser.role == 'Admin') {
                DB.Models.User.findOne({ devices: Types.ObjectId(deviceID) }, (err, realOwner) => {
                    if (err) {
                        appLogger.error('Middleware(Authorization)', JSON.stringify(err));
                        return res.status(500).json({
                            err: {
                                message: err
                            }
                        });
                    }

                    if (realOwner == null) {
                        appLogger.warning('Middleware(Authorization)', 'User not found');
                        return res.status(404).json({
                            err: {
                                message: 'User not found'
                            }
                        });
                    }

                    req.query.user = realOwner._id;
                    appLogger.verbose('Middleware(Authorization)', 'Admin verified');

                    return next();
                });
            } else {
                let index = ownerUser.devices.indexOf(Types.ObjectId(deviceID));
                if (index < 0) {
                    appLogger.warning('Middleware(Authorization)', 'Device not found');
                    return res.status(404).json({
                        err: {
                            message: 'Device not found'
                        }
                    });
                }

                appLogger.verbose('Middleware(Authorization)', 'Device ownership verified');
                next();
            }
        });
    }

    public static verifyAppOwnership(req: Request, res: Response, next: Function): void {
        appLogger.verbose('Middleware(Authorization)', 'Verify app ownership');
        let owner = String(req.query.user);
        let appID = String(req.params.id);

        DB.Models.User.findById(owner, (err, ownerUser) => {
            if (err) {
                appLogger.error('Middleware(Authorization)', JSON.stringify(err));
                return res.status(500).json({
                    err: {
                        message: err
                    }
                });
            }

            if (ownerUser == null) {
                appLogger.warning('Middleware(Authorization)', 'User not found');
                if (req.params.action == 'render') {
                    return res.sendFile(resolvePath(__dirname, '../../../public/error/401/index.html'));
                    // return res.json({
                    //     err: {
                    //         message: 'Sin autorización'
                    //     }
                    // });
                } else {
                    return res.status(404).json({
                        err: {
                            message: 'User not found'
                        }
                    });
                }
            }

            // admin allowed
            if (ownerUser.role == 'Admin') {
                DB.Models.User.findOne({ apps: Types.ObjectId(appID) }, (err, realOwner) => {
                    if (err) {
                        appLogger.error('Middleware(Authorization)', JSON.stringify(err));
                        return res.status(500).json({
                            err: {
                                message: err
                            }
                        });
                    }

                    if (realOwner == null) {
                        appLogger.warning('Middleware(Authorization)', 'User not found');
                        return res.status(404).json({
                            err: {
                                message: 'User not found'
                            }
                        });
                    }

                    if (req.params.action == 'render') {
                        return next();
                    }

                    req.query.user = realOwner._id;
                    appLogger.verbose('Middleware(Authorization)', 'Admin verified');

                    return next();
                });
            } else {
                let index = ownerUser.apps.indexOf(Types.ObjectId(appID));
                if (index < 0) {
                    appLogger.warning('Middleware(Authorization)', 'App not found');
                    if (req.params.action == 'render') {
                        return res.sendFile(resolvePath(__dirname, '../../../public/error/403/index.html'));
                        // return res.json({
                        //     err: {
                        //         message: 'Sin autorización'
                        //     }
                        // });
                    } else {
                        return res.status(404).json({
                            err: {
                                message: 'App not found'
                            }
                        });
                    }
                }

                appLogger.verbose('Middleware(Authorization)', 'App ownership verified');
                next();
            }
        });
    }
}

export default Authorization;