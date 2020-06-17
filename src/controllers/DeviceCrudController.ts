import { Request, Response } from 'express';
import { CRUD_Controller } from "../interfaces/crudController";
import { DB } from '../interfaces/dbManager';
import { randomBytes as CryptoRandomBytes } from 'crypto';

import _ = require('underscore');
import { appLogger } from '../config/constants';
import { Types } from 'mongoose';

export class DeviceCrudController extends CRUD_Controller {
    public create(req: Request<import("express-serve-static-core").ParamsDictionary, any, any, import("qs").ParsedQs>, res: Response<any>): void {
        let data = _.pick(req.body, ['name', 'description', 'userID']);

        let apiKeyLength = 64;
        let apiKey = CryptoRandomBytes(Math.ceil(apiKeyLength / 2))
            .toString('hex')
            .slice(0, apiKeyLength);

        DB.Models.User.findById(data.userID, (err, userDB) => {
            if (err) {
                return res.status(500).json({
                    err: {
                        message: err
                    }
                });
            }

            if (userDB == null) {
                return res.status(404).json({
                    err: {
                        message: 'Device not created, could not find User'
                    }
                });
            }

            let device = new DB.Models.Device({ name: data.name, description: data.description, apiKey });

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
                        return res.status(500).json({
                            err: {
                                message: err
                            }
                        });
                    }
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
            if(err) {
                return res.status(500).json({
                    err: {
                        message: err
                    }
                });
            }

            if(userDB == null) {
                return res.status(404).json({
                    err: {
                        message: 'User not found'
                    }
                })
            }

            DB.Models.Device.find({_id: userDB.devices}, (err, devices) => {
                if(err) {
                    return res.status(500).json({
                        err: {
                            message: err
                        }
                    })
                }
                res.json({
                    devices
                });
            });
        });
    }

    public readOne(req: Request<import("express-serve-static-core").ParamsDictionary, any, any, import("qs").ParsedQs>, res: Response<any>): void {
        let deviceID = String(req.params.id);

        DB.Models.Device.findById(deviceID, (err, deviceDB) => {
            if(err) {
                return res.status(500).json({
                    err: {
                        message: err
                    }
                });
            }
            if(deviceDB == null) {
                return res.status(404).json({
                    err: {
                        message: 'Device not found'
                    }
                });
            }

            res.json({
                device: deviceDB
            });
        });
    }

    public update(req: Request<import("express-serve-static-core").ParamsDictionary, any, any, import("qs").ParsedQs>, res: Response<any>): void {
        let data = _.pick(req.body, ['name', 'description']);

        let deviceID = String(req.params.id);

        DB.Models.Device.findByIdAndUpdate(deviceID, data, (err, deviceDB) => {
            if(err) {
                return res.status(500).json({
                    err: {
                        message: err
                    }
                });
            }
            if(deviceDB == null) {
                return res.status(404).json({
                    err: {
                        message: 'Device not found'
                    }
                });
            }

            res.json({
                message: 'Device updated successfully'
            });
        });
    }

    public delete(req: Request<import("express-serve-static-core").ParamsDictionary, any, any, import("qs").ParsedQs>, res: Response<any>): void {
        let deviceID = String(req.params.id);
        let deviceOwner = String(req.query.user);

        DB.Models.Device.findByIdAndDelete(deviceID, (err, deviceDB) => {
            if(err) {
                return res.status(500).json({
                    err: {
                        message: err
                    }
                });
            }
            if(deviceDB == null) {
                return res.status(404).json({
                    err: {
                        message: 'Device not found'
                    }
                });
            }

            DB.Models.User.findById(deviceOwner, (err, userDB) => {
                if(err) {
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

                DB.Models.User.findByIdAndUpdate(deviceOwner, {devices}, (err, updatedUser) => {
                    if(err) {
                        return res.status(500).json({
                            err: {
                                message: err
                            }
                        });
                    }
                    res.json({
                        message: 'Device deleted successfully'
                    });
                });
            });
        });
    }
}
