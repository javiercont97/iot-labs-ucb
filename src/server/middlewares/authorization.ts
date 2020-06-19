import { Request, Response } from 'express';
import { DB } from '../../interfaces/dbManager';
import { Types } from 'mongoose';
import { appLogger } from '../../config/constants';


class Authorization {

    public static verifyDeviceOwnership(req: Request, res: Response, next: Function): void {
        appLogger.verbose('Middleware(Authorization)', 'Verify device ownership');
        let owner = String(req.query.user);
        let deviceID = String(req.params.id);

        DB.Models.User.findById(owner, (err, ownerUser) => {
            if(err) {
                appLogger.error('Middleware(Authorization)', JSON.stringify(err));
                return res.status(500).json({
                    err: {
                        message: err
                    }
                });
            }

            if(ownerUser == null) {
                appLogger.warning('Middleware(Authorization)', 'User not found');
                return res.status(404).json({
                    err: {
                        message: 'User not found'
                    }
                });
            }

            let index = ownerUser.devices.indexOf(Types.ObjectId(deviceID));
            if(index < 0) {
                appLogger.warning('Middleware(Authorization)', 'Device not found');
                return res.status(404).json({
                    err: {
                        message: 'Device not found'
                    }
                });
            }

            appLogger.verbose('Middleware(Authorization)', 'Device ownership verified');
            next();
        });
    }

    public static verifyAppOwnership(req: Request, res: Response, next: Function): void {
        appLogger.verbose('Middleware(Authorization)', 'Verify app ownership');
        let owner = String(req.query.user);
        let appID = String(req.params.id);

        DB.Models.User.findById(owner, (err, ownerUser) => {
            if(err) {
                appLogger.error('Middleware(Authorization)', JSON.stringify(err));
                return res.status(500).json({
                    err: {
                        message: err
                    }
                });
            }

            if(ownerUser == null) {
                appLogger.warning('Middleware(Authorization)', 'User not found');
                return res.status(404).json({
                    err: {
                        message: 'User not found'
                    }
                });
            }

            let index = ownerUser.apps.indexOf(Types.ObjectId(appID));
            if(index < 0) {
                appLogger.warning('Middleware(Authorization)', 'App not found');
                return res.status(404).json({
                    err: {
                        message: 'App not found'
                    }
                });
            }

            appLogger.verbose('Middleware(Authorization)', 'App ownership verified');
            next();
        });
    }
}

export default Authorization;