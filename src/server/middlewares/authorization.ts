import { Request, Response } from 'express';
import { DB } from '../../interfaces/dbManager';
import { Types } from 'mongoose';


class Authorization {

    public static verifyDeviceOwnership(req: Request, res: Response, next: Function): void {
        let owner = String(req.query.user);
        let deviceID = String(req.params.id);

        DB.Models.User.findById(owner, (err, ownerUser) => {
            if(err) {
                return res.status(500).json({
                    err: {
                        message: err
                    }
                });
            }

            if(ownerUser == null) {
                return res.status(404).json({
                    err: {
                        message: 'User not found'
                    }
                });
            }

            let index = ownerUser.devices.indexOf(Types.ObjectId(deviceID));
            if(index < 0) {
                return res.status(404).json({
                    err: {
                        message: 'Device not found'
                    }
                });
            }

            next();
        });
    }

    public static verifyAppOwnership(req: Request, res: Response, next: Function): void {
        let owner = String(req.query.user);
        let appID = String(req.params.id);

        DB.Models.User.findById(owner, (err, ownerUser) => {
            if(err) {
                return res.status(500).json({
                    err: {
                        message: err
                    }
                });
            }

            if(ownerUser == null) {
                return res.status(404).json({
                    err: {
                        message: 'User not found'
                    }
                });
            }

            let index = ownerUser.apps.indexOf(Types.ObjectId(appID));
            if(index < 0) {
                return res.status(404).json({
                    err: {
                        message: 'App not found'
                    }
                });
            }

            next();
        });
    }
}

export default Authorization;