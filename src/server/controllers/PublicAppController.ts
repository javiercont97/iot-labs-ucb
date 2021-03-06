import { Request, Response } from 'express';
import { DB } from '../../interfaces/dbManager';

import { appLogger } from '../../config/constants';


export class PublicAppController {

    public static listPublicApps(req: Request<import("express-serve-static-core").ParamsDictionary, any, any, import("qs").ParsedQs>, res: Response<any>): void {

        DB.Models.App.find({ privacyLevel: 1 }, async (err, publicApps) => {
            if (err) {
                appLogger.error('CRUD App (Read Public)', JSON.stringify(err));
                return res.status(500).json({
                    err: {
                        message: err
                    }
                });
            }

            let auxModel = [];

            for (let i = 0; i < publicApps.length; i++) {
                let owner = await DB.Models.User.findOne({apps: publicApps[i]._id});

                let appWithOwner = publicApps[i].toJSON();
                appWithOwner['owner'] = owner.name;
                auxModel.push(appWithOwner);
            }

            return res.status(200).json({
                apps: auxModel
            });
        });
    }
}