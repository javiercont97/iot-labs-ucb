import { Request, Response } from 'express';
import { DB } from '../../interfaces/dbManager';
import { appLogger } from '../../config/constants';
import { PrivacyLevelEnum } from '../../models/App';
import Authentication from './authentication';
import { resolve as resolvePath } from 'path';


export const checkAppPrivacyLevel = (req: Request, res: Response, next: Function) => {
    let appID = String(req.params.appID);

    DB.Models.App.findById(appID, (err, appDB) => {
        if (err) {
            appLogger.error('Middleware (App Privacy Level)', JSON.stringify(err));
            return res.status(500).json({
                err: {
                    message: err
                }
            });
        }

        if (appDB == null) {
            appLogger.warning('Middleware (App Privacy Level)', 'App not found');
            return res.sendFile(resolvePath(__dirname, '../../../public/error/404/index.html'));
            // return res.json({
            //     err: {
            //         message: 'Aplicación no encontrada'
            //     }
            // });
        }

        if (appDB.privacyLevel == PrivacyLevelEnum.PUBLIC) {
            appLogger.verbose('Middleware (App Privacy Level)', 'Render public app');
            next();
        } else {
            appLogger.warning('Middleware (App Privacy Level)', 'Before rendering private app, verify app ownership');
            let owner = String(req.query.user);
            if (owner != 'undefined') {
                req.params.id = appID;
                req.params.action = 'render';
                Authentication.verifySessionActive(req, res, next);
            } else {
                if(req.params.file != undefined) {
                    let aux = req.params.file.split('.');
                    if (aux[aux.length - 1] != 'html') {
                        next();
                    } else {
                        appLogger.error('Middleware (App Privacy Level)', 'Unauthorized');
                        return res.sendFile(resolvePath(__dirname, '../../../public/error/401/index.html'));
                        // return res.json({
                        //     err: {
                        //         message: 'Sin autorización'
                        //     }
                        // });
                    }
                } else {
                    appLogger.error('Middleware (App Privacy Level)', 'Unauthorized');
                    return res.sendFile(resolvePath(__dirname, '../../../public/error/401/index.html'));
                    // return res.json({
                    //     err: {
                    //         message: 'Sin autorización'
                    //     }
                    // });
                }
            }
        }
    });
}
