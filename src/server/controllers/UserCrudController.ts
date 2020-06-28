import { Request, Response } from 'express';
import { CRUD_Controller } from '../interfaces/crudController';
import { PasswordHaher } from '../../middlewares/security/passwordHashing';
import { appLogger } from '../../config/constants';
import { DB } from '../../interfaces/dbManager';

import _ = require('underscore');
import Mailer from '../../middlewares/notification/mailer';

import { rmdirSync as deleteDir } from 'fs';
import { resolve as resolvePath } from 'path';

export class UserCrudController extends CRUD_Controller {
    public create(req: Request<import("express-serve-static-core").ParamsDictionary, any, any, import("qs").ParsedQs>, res: Response<any>): void {
        let data = _.pick(req.body, ['name', 'password', 'email', 'role']);
        // Hash password
        data.password = PasswordHaher.saltHashPassword(data.password);
        
        let creationData: any = {
            ...data
        };

        if(data.role == 'Admin') {
            creationData.status = true
        }

        DB.Models.User.findOne({ name: data.name }, (err, userWithName) => {
            if (err) {
                appLogger.error('CRUD User (Create)', JSON.stringify(err));
                return res.status(500).json({
                    err
                });
            } else {
                if( userWithName != null ) {
                    return res.status(400).json({
                        err: {
                            message: 'El nombre de usuario ya existe'
                        }
                    });
                } else {
                    DB.Models.User.findOne({ email: data.email }, (err, userWithEmail) => {
                        if (err) {
                            appLogger.error('CRUD User (Create)', JSON.stringify(err));
                            return res.status(500).json({
                                err
                            });
                        } else {
                            if( userWithEmail != null ) {
                                return res.status(400).json({
                                    err: {
                                        message: 'El correo ya fue registrado'
                                    }
                                });
                            } else {
                                let user = new DB.Models.User(creationData);

                                user.save((err, userDB) => {
                                    if (err) {
                                        appLogger.error('CRUD User (Create)', JSON.stringify(err));
                                        return res.status(500).json({
                                            err
                                        });
                                    } else {
                                        if (data.role != 'Admin') {
                                            Mailer.sendActivationEmail(userDB.id, userDB.email, userDB.name);
                                        }

                                        appLogger.verbose('CRUD User (Create)', 'User created');
                                        return res.json({
                                            message: `User created successfully (ID=${userDB.id})`
                                        });
                                    }
                                });
                            }
                        }
                    });
                }
            }
        });
    }

    public read(req: Request<import("express-serve-static-core").ParamsDictionary, any, any, import("qs").ParsedQs>, res: Response<any>): void {
        appLogger.warning('CRUD User (Read list)', 'Method not implemented');
        res.status(501).json({
            err: {
                message: "Route callback unimplemented"
            }
        });
    }

    public readOne(req: Request<import("express-serve-static-core").ParamsDictionary, any, any, import("qs").ParsedQs>, res: Response<any>): void {
        let id = req.params.id;

        DB.Models.User.findById(id, 'name email salutation img role apps devices openSessions', (err, userDB) => {
            if (err) {
                appLogger.error('CRUD User (Read one)', JSON.stringify(err));
                res.status(404).json({
                    err
                });
            } else {
                appLogger.verbose('CRUD User (Read one)', 'User retrieved');
                return res.json({
                    user: userDB
                });
            }
        });
    }

    public update(req: Request<import("express-serve-static-core").ParamsDictionary, any, any, import("qs").ParsedQs>, res: Response<any>): void {
        let data = _.pick(req.body, ['name', 'email', 'salutation', 'img', 'password']);
        let id = req.params.id;

        if('password' in data) {
            // Hash password
            data.password = PasswordHaher.saltHashPassword(data.password);
        }


        DB.Models.User.findByIdAndUpdate(id, data, (err, userDB) => {
            if (err) {
                appLogger.error('CRUD User (Update)', JSON.stringify(err));
                res.status(404).json({
                    err
                });
            } else {
                appLogger.verbose('CRUD User (Update)', 'User updated');
                return res.json({
                    message: 'User updated successfully'
                });
            }
        });
    }

    public delete(req: Request<import("express-serve-static-core").ParamsDictionary, any, any, import("qs").ParsedQs>, res: Response<any>): void {
        let id = req.params.id;

        DB.Models.User.findByIdAndDelete(id, (err, userDB) => {
            if (err) {
                appLogger.error('CRUD User (Delete)', JSON.stringify(err));
                return res.status(404).json({
                    err: {
                        message: err
                    }
                });
            }

            DB.Models.Device.remove({_id: userDB.devices}, (err) => {
                if (err) {
                    appLogger.error('CRUD User (Delete)', JSON.stringify(err));
                    return res.status(404).json({
                        err: {
                            message: err
                        }
                    });
                }

                DB.Models.App.find( {_id: userDB.apps}, (err, apps) => {
                    if (err) {
                        appLogger.error('CRUD User (Delete)', JSON.stringify(err));
                        return res.status(404).json({
                            err: {
                                message: err
                            }
                        });
                    }

                    apps.forEach(app => {
                        let filePath = resolvePath(__dirname, `../../../app/${app._id}`);
                        deleteDir(filePath, {recursive: true});
                    });

                    DB.Models.App.remove({_id: userDB.apps}, (err) => {
                        if (err) {
                            appLogger.error('CRUD User (Delete)', JSON.stringify(err));
                            return res.status(404).json({
                                err: {
                                    message: err
                                }
                            });
                        }
                        appLogger.verbose('CRUD User (Delete)', 'User deleted');
                        return res.json({
                            message: 'User deleted successfully'
                        });
                    });
                });
            });
        });
    }
}
