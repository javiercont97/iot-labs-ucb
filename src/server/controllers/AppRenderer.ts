import { Request, Response } from 'express';
import { resolve as resolvePath } from 'path';
import { DB } from '../../interfaces/dbManager';
import { appLogger, HOST_URL } from '../../config/constants';

export class AppRenderer {
    public static redirectToApp(req: Request, res: Response): void {
        let appID = String(req.params.appID);

        DB.Models.App.findById(appID, (err, appDB) => {
            if (err) {
                appLogger.error('App renderer', JSON.stringify(err));
                return res.status(500).json({
                    err
                });
            }

            if (appDB == null) {
                appLogger.warning('App renderer', 'App not found');
                
                // return res.status(404).json({
                //     err: {
                //         message: 'Aplicación no encontrada'
                //     }
                // });
                return res.sendFile(resolvePath(__dirname, '../../../public/error/404/index.html'));
            }

            let resources = appDB.resourceFiles;

            let index = resources.findIndex(file => {
                let aux = file.split('.');
                let extention = aux[aux.length - 1];
                return extention == 'html';
            });

            if (index < 0) {
                return res.sendFile(resolvePath(__dirname, '../../../public/error/404/index.html'));
                // return res.status(404).json({
                //     err: {
                //         message: 'Resource not found'
                //     }
                // });
            }


            //========================================
            let user: string;
            if (req.query.user) {
                user = String(req.query.user);
            } else {
                user = req.get('user');
            }
            let session: string;
            if (req.query.session) {
                session = String(req.query.session);
            } else {
                session = req.get('session');
            }
            //========================================

            if (user == undefined && session == undefined) {
                return res.status(301).redirect(`${HOST_URL}/api/render/${appID}/${resources[index]}`);
            }
            res.status(301).redirect(`${HOST_URL}/api/render/${appID}/${resources[index]}?user=${user}&session=${session}`);
        });
    }

    public static getAppResource(req: Request, res: Response): void {
        let appID = String(req.params.appID);
        let fileName = String(req.params.file);
        let appPath = resolvePath(__dirname, `../../../app/${appID}/`);

        DB.Models.App.findById(appID, (err, appDB) => {
            if (err) {
                appLogger.info('App renderer', JSON.stringify(err));
                return res.status(500).json({
                    err
                });
            }

            if (appDB == null) {
                appLogger.info('App renderer', 'App not found');
                return res.sendFile(resolvePath(__dirname, '../../../public/error/403/index.html'));
                // return res.status(308).redirect(`${HOST_URL}/appnotfound`);
            }

            // if (appDB.resourceFiles.indexOf(fileName) < 0) {
            //     appLogger.info('App renderer', 'Resource not found');
            //     return res.status(308).redirect(`${HOST_URL}/appnotfound`);
            // }

            res.sendFile(resolvePath(appPath, fileName));
        });
    }
}