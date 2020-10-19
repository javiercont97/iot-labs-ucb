import { Request, Response } from 'express';
import { CRUD_Controller } from "../interfaces/crudController";
import { DB } from '../../interfaces/dbManager';

import _ = require('underscore');
import { appLogger } from '../../config/constants';
import { Types } from 'mongoose';
import { generateApiKey } from '../../middlewares/security/apiKeyGenerator';

export class DeviceCrudController extends CRUD_Controller {
    public create(req: Request<import("express-serve-static-core").ParamsDictionary, any, any, import("qs").ParsedQs>, res: Response<any>): void {
        let data = _.pick(req.body, ['name', 'description', 'userID']);

        DB.Models.User.findById(data.userID, (err, userDB) => {
            if (err) {
                appLogger.error('CRUD Device (Create)', JSON.stringify(err));
                return res.status(500).json({
                    err: {
                        message: err
                    }
                });
            }

            if (userDB == null) {
                appLogger.warning('CRUD Device (Create)', 'Device not created, could not find User');
                return res.status(404).json({
                    err: {
                        message: 'Device not created, could not find User'
                    }
                });
            }


            let apiKey = generateApiKey();
            let creationData: any = {
                name: data.name,
                description: data.description,
                apiKey
            };

            let device = new DB.Models.Device(creationData);

            device.save((err, deviceDB) => {
                if (err) {
                    appLogger.error('CRUD Device (Create)', JSON.stringify(err));
                    return res.status(500).json({
                        err: {
                            message: err
                        }
                    });
                }

                let devices = userDB.devices;
                devices.push(Types.ObjectId(`${deviceDB.id}`));

                DB.Models.User.findByIdAndUpdate(userDB.id, { devices }, (err, appenddedUser) => {
                    if (err) {
                        appLogger.error('CRUD Device (Create)', JSON.stringify(err));
                        return res.status(500).json({
                            err: {
                                message: err
                            }
                        });
                    }
                    appLogger.verbose('CRUD Device (Create)', 'Device created');
                    return res.json({
                        message: `Device created successfully (ID=${deviceDB.id}) for user ID=${appenddedUser.id}`
                    });
                });
            });

        });

    }

    public read(req: Request<import("express-serve-static-core").ParamsDictionary, any, any, import("qs").ParsedQs>, res: Response<any>): void {
        let ownerID = String(req.query.user);
        DB.Models.User.findById(ownerID, (err, userDB) => {
            if (err) {
                appLogger.error('CRUD Device (Read List)', JSON.stringify(err));
                return res.status(500).json({
                    err: {
                        message: err
                    }
                });
            }

            if (userDB == null) {
                appLogger.warning('CRUD Device (Read List)', 'User not found');
                return res.status(404).json({
                    err: {
                        message: 'User not found'
                    }
                })
            }

            DB.Models.Device.find({ _id: userDB.devices }, (err, devices) => {
                if (err) {
                    appLogger.error('CRUD Device (Read List)', JSON.stringify(err));
                    return res.status(500).json({
                        err: {
                            message: err
                        }
                    })
                }
                appLogger.verbose('CRUD Device (Read List)', 'Devices list retrieved');
                res.json({
                    devices
                });
            });
        });
    }

    public readOne(req: Request<import("express-serve-static-core").ParamsDictionary, any, any, import("qs").ParsedQs>, res: Response<any>): void {
        let deviceID = String(req.params.id);

        DB.Models.Device.findById(deviceID, (err, deviceDB) => {
            if (err) {
                appLogger.error('CRUD Device (Read One)', JSON.stringify(err));
                return res.status(500).json({
                    err: {
                        message: err
                    }
                });
            }
            if (deviceDB == null) {
                appLogger.warning('CRUD Device (Read One)', 'Device not found');
                return res.status(404).json({
                    err: {
                        message: 'Device not found'
                    }
                });
            }

            appLogger.verbose('CRUD Device (Read One)', 'Device retrieved');
            res.json({
                device: deviceDB
            });
        });
    }

    public update(req: Request<import("express-serve-static-core").ParamsDictionary, any, any, import("qs").ParsedQs>, res: Response<any>): void {
        let data = _.pick(req.body, ['name', 'description', 'app']);

        let deviceID = String(req.params.id);

        DB.Models.Device.findByIdAndUpdate(deviceID, data, (err, deviceDB) => {
            if (err) {
                appLogger.error('CRUD Device (Update)', JSON.stringify(err));
                return res.status(500).json({
                    err: {
                        message: err
                    }
                });
            }
            if (deviceDB == null) {
                appLogger.warning('CRUD Device (Update)', 'Device not found');
                return res.status(404).json({
                    err: {
                        message: 'Device not found'
                    }
                });
            }

            appLogger.verbose('CRUD Device (Update)', 'Device updated');
            res.json({
                message: 'Device updated successfully'
            });
        });
    }

    public delete(req: Request<import("express-serve-static-core").ParamsDictionary, any, any, import("qs").ParsedQs>, res: Response<any>): void {
        let deviceID = String(req.params.id);
        let deviceOwner = String(req.query.user);

        DB.Models.Device.findByIdAndDelete(deviceID, (err, deviceDB) => {
            if (err) {
                appLogger.error('CRUD Device (Delete)', JSON.stringify(err));
                return res.status(500).json({
                    err: {
                        message: err
                    }
                });
            }
            if (deviceDB == null) {
                appLogger.warning('CRUD Device (Delete)', 'Device not found');
                return res.status(404).json({
                    err: {
                        message: 'Device not found'
                    }
                });
            }

            DB.Models.User.findById(deviceOwner, (err, userDB) => {
                if (err) {
                    appLogger.error('CRUD Device (Delete)', JSON.stringify(err));
                    return res.status(500).json({
                        err: {
                            message: err
                        }
                    });
                }

                let devices = userDB.devices;
                devices = devices.filter(dev => {
                    return String(dev) != deviceID;
                });

                DB.Models.User.findByIdAndUpdate(deviceOwner, { devices }, (err, updatedUser) => {
                    if (err) {
                        appLogger.error('CRUD Device (Delete)', JSON.stringify(err));
                        return res.status(500).json({
                            err: {
                                message: err
                            }
                        });
                    }
                    appLogger.verbose('CRUD Device (Delete)', 'Device deleted');
                    res.json({
                        message: 'Device deleted successfully'
                    });
                });
            });
        });
    }
}
