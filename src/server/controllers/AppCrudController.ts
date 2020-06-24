import { Request, Response } from 'express';
import { CRUD_Controller } from "../interfaces/crudController";
import { DB } from '../../interfaces/dbManager';

import _ = require('underscore');
import { appLogger, ALLOWED_EXTENTIONS, MAX_FILE_SIZE } from '../../config/constants';
import { Types } from 'mongoose';
import { UploadedFile } from 'express-fileupload';
import { resolve as resolvePath } from 'path';
import { generateApiKey } from '../../middlewares/security/apiKeyGenerator';
import { PrivacyLevelEnum } from '../../models/App';
import { Extract as extractZIP } from 'unzipper';
import { createReadStream as zipReadStream, unlink, rmdir, readdirSync as listItems } from 'fs';


export class AppCrudController extends CRUD_Controller {
    public create(req: Request<import("express-serve-static-core").ParamsDictionary, any, any, import("qs").ParsedQs>, res: Response<any>): void {
        let data = _.pick(req.body, ['name', 'description', 'userID', 'privacyLevel']);

        DB.Models.User.findById(data.userID, (err, userDB) => {
            if (err) {
                appLogger.error('CRUD App (Create)', JSON.stringify(err));
                return res.status(500).json({
                    err: {
                        message: err
                    }
                });
            }

            if (userDB == null) {
                appLogger.warning('CRUD App (Create)', 'App not created, could not find User');
                return res.status(404).json({
                    err: {
                        message: 'App not created, could not fund User'
                    }
                });
            }

            let apiKey = generateApiKey();
            let app = new DB.Models.App({ name: data.name, description: data.description, apiKey, privacyLevel: (data.privacyLevel == 'PUBLIC' ? PrivacyLevelEnum.PUBLIC : PrivacyLevelEnum.PRIVATE) });

            app.save((err, appDB) => {
                if (err) {
                    appLogger.error('CRUD App (Create)', JSON.stringify(err));
                    return res.status(500).json({
                        err: {
                            message: err
                        }
                    });
                }

                let apps = userDB.apps;
                apps.push(Types.ObjectId(`${appDB._id}`));

                DB.Models.User.findByIdAndUpdate(userDB._id, { apps }, (err, appendedUser) => {
                    if (err) {
                        appLogger.error('CRUD App (Create)', JSON.stringify(err));
                        return res.status(500).json({
                            err: {
                                message: err
                            }
                        });
                    }
                    appLogger.verbose('CRUD App (Create)', 'App created');

                    let appFile: UploadedFile = req.files.appFiles || req.files.appFiles[0];
                    let filePath = resolvePath(__dirname, `../../../app/${appDB._id}.zip`);
                    appFile.mv(filePath, (err) => {
                        if (err) {
                            appLogger.error('CRUD App (Create)', JSON.stringify(err));
                            return res.status(500).json({
                                err: {
                                    message: err
                                }
                            });
                        }
                        zipReadStream(filePath)
                            .pipe(extractZIP({ path: resolvePath(__dirname, `../../../app/${appDB._id}`) }))
                            .promise()
                            .then(() => {
                                appLogger.verbose('CRUD App (Create)', 'ZIP file extracted');
                                unlink(filePath, (err) => {
                                    if (err) {
                                        appLogger.error('CRUD App (Create)', JSON.stringify(err));
                                        return res.status(500).json({
                                            err: {
                                                message: err
                                            }
                                        });
                                    }
                                    appLogger.verbose('CRUD App (Create)', 'ZIP file removed');
                                    let listOfFiles = listItems(resolvePath(__dirname, `../../../app/${appDB._id}`));

                                    DB.Models.App.findByIdAndUpdate(appDB._id, { resourceFiles: listOfFiles }, (err, finalAppDB) => {
                                        if (err) {
                                            appLogger.error('CRUD App (Create)', JSON.stringify(err));
                                            return res.status(500).json({
                                                err: {
                                                    message: err
                                                }
                                            });
                                        }
                                        
                                        res.json({
                                            message: `App created successfully (ID=${appDB._id}) for user ID=${appendedUser._id}`
                                        });
                                    });
                                });
                            }).catch(err => {
                                appLogger.error('CRUD App (Create)', JSON.stringify(err));
                                return res.status(500).json({
                                    err: {
                                        message: err
                                    }
                                });
                            });
                    });
                });
            });
        });
    }

    public read(req: Request<import("express-serve-static-core").ParamsDictionary, any, any, import("qs").ParsedQs>, res: Response<any>): void {
        let ownerID = String(req.query.user);
        DB.Models.User.findById(ownerID, (err, userDB) => {
            if (err) {
                appLogger.error('CRUD App (Read List)', JSON.stringify(err));
                return res.status(500).json({
                    err: {
                        message: err
                    }
                });
            }

            if (userDB == null) {
                appLogger.warning('CRUD App (Read List)', 'User not found');
                return res.status(404).json({
                    err: {
                        message: 'User not found'
                    }
                })
            }

            DB.Models.App.find({ _id: userDB.apps }, (err, apps) => {
                if (err) {
                    appLogger.error('CRUD App (Read List)', JSON.stringify(err));
                    return res.status(500).json({
                        err: {
                            message: err
                        }
                    })
                }
                appLogger.verbose('CRUD App (Read List)', 'Apps list retrieved');
                res.json({
                    apps
                });
            });
        });
    }

    public readOne(req: Request<import("express-serve-static-core").ParamsDictionary, any, any, import("qs").ParsedQs>, res: Response<any>): void {
        let appID = String(req.params.id);

        DB.Models.App.findById(appID, (err, appDB) => {
            if (err) {
                appLogger.error('CRUD App (Read One)', JSON.stringify(err));
                return res.status(500).json({
                    err: {
                        message: err
                    }
                });
            }
            if (appDB == null) {
                appLogger.warning('CRUD App (Read One)', 'App not found');
                return res.status(404).json({
                    err: {
                        message: 'App not found'
                    }
                });
            }

            appLogger.verbose('CRUD App (Read One)', 'App retrieved');
            res.json({
                app: appDB
            });
        });
    }

    public update(req: Request<import("express-serve-static-core").ParamsDictionary, any, any, import("qs").ParsedQs>, res: Response<any>): void {
        let data = _.pick(req.body, ['name', 'description', 'privacyLevel']);
        if (data.privacyLevel) {
            data.privacyLevel = data.privacyLevel == 'PUBLIC' ? PrivacyLevelEnum.PUBLIC : PrivacyLevelEnum.PRIVATE;
        }

        let appID = String(req.params.id);

        DB.Models.App.findByIdAndUpdate(appID, data, (err, appDB) => {
            if (err) {
                appLogger.error('CRUD App (Update)', JSON.stringify(err));
                return res.status(500).json({
                    err: {
                        message: err
                    }
                });
            }
            if (appDB == null) {
                appLogger.warning('CRUD App (Update)', 'App not found');
                return res.status(404).json({
                    err: {
                        message: 'App not found'
                    }
                });
            }

            if (req.files) {
                let appFile: UploadedFile = req.files.appFiles || req.files.appFiles[0];
                let fileName = String(appFile.name).split('.');
                let extention = fileName[fileName.length - 1];

                if (ALLOWED_EXTENTIONS.indexOf(extention) < 0) {
                    appLogger.error('File Validator', `File extention is not allowed [${extention}]`);
                    return res.status(400).json({
                        err: {
                            message: 'Allowed file extentions are: [' + ALLOWED_EXTENTIONS.join(', ') + ']'
                        }
                    });
                }

                if ((appFile.size / 1048576) > MAX_FILE_SIZE) {
                    appLogger.error('File Validator', `Max file size is 25[MB], this file is ${appFile.size / 1048576}[MB]`);
                    res.status(400).json({
                        err: {
                            message: `Max file size is 25[MB], this file is ${appFile.size / 1048576}[MB]`
                        }
                    });
                }

                let appPath = resolvePath(__dirname, `../../../app/${appDB._id}`);
                rmdir(appPath, { recursive: true }, (err) => {
                    if (err) {
                        appLogger.error('CRUD App (Update)', JSON.stringify(err));
                        return res.status(500).json({
                            err: {
                                message: err
                            }
                        })
                    };
                    appLogger.verbose('CRUD App (Update)', 'Previous app removed');
                    let filePath = resolvePath(__dirname, `../../../app/${appDB._id}.zip`);
                    appFile.mv(filePath, (err) => {
                        if (err) {
                            appLogger.error('CRUD App (Create)', JSON.stringify(err));
                            return res.status(500).json({
                                err: {
                                    message: err
                                }
                            });
                        }
                        zipReadStream(filePath)
                            .pipe(extractZIP({ path: resolvePath(__dirname, `../../../app/${appDB._id}`) }))
                            .promise()
                            .then(() => {
                                appLogger.verbose('CRUD App (Create)', 'ZIP file extracted');
                                unlink(filePath, (err) => {
                                    if (err) {
                                        appLogger.error('CRUD App (Create)', JSON.stringify(err));
                                        return res.status(500).json({
                                            err: {
                                                message: err
                                            }
                                        });
                                    }
                                    appLogger.verbose('CRUD App (Create)', 'ZIP file removed');
                                    appLogger.verbose('CRUD App (Update)', 'App updated');
                                    res.json({
                                        message: 'App updated successfully'
                                    });
                                });
                            }).catch(err => {
                                appLogger.error('CRUD App (Create)', JSON.stringify(err));
                                return res.status(500).json({
                                    err: {
                                        message: err
                                    }
                                });
                            });
                    });
                });
            } else {
                appLogger.verbose('CRUD App (Update)', 'App updated');
                res.json({
                    message: 'App updated successfully'
                });
            }
        });
    }

    public delete(req: Request<import("express-serve-static-core").ParamsDictionary, any, any, import("qs").ParsedQs>, res: Response<any>): void {
        let appID = String(req.params.id);
        let appOwner = String(req.query.user);

        DB.Models.App.findByIdAndDelete(appID, (err, appDB) => {
            if (err) {
                appLogger.error('CRUD App (Delete)', JSON.stringify(err));
                return res.status(500).json({
                    err: {
                        message: err
                    }
                });
            }
            if (appDB == null) {
                appLogger.warning('CRUD App (Delete)', 'App not found');
                return res.status(404).json({
                    err: {
                        message: 'App not found'
                    }
                });
            }

            DB.Models.User.findById(appOwner, (err, userDB) => {
                if (err) {
                    appLogger.error('CRUD App (Delete)', JSON.stringify(err));
                    return res.status(500).json({
                        err: {
                            message: err
                        }
                    });
                }

                let apps = userDB.apps;
                apps = apps.filter(app_id => {
                    return String(app_id) != appID;
                });

                DB.Models.User.findByIdAndUpdate(appOwner, { apps }, (err, updatedUser) => {
                    if (err) {
                        appLogger.error('CRUD App (Delete)', JSON.stringify(err));
                        return res.status(500).json({
                            err: {
                                message: err
                            }
                        });
                    }
                    let filePath = resolvePath(__dirname, `../../../app/${appDB._id}`);
                    rmdir(filePath, { recursive: true }, (err) => {
                        if (err) {
                            appLogger.error('CRUD App (Delete)', JSON.stringify(err));
                            return res.status(500).json({
                                err: {
                                    message: err
                                }
                            })
                        };
                        appLogger.verbose('CRUD App (Delete)', 'App deleted');
                        res.json({
                            message: 'App deleted successfully'
                        });
                    });
                });
            });
        });
    }
}