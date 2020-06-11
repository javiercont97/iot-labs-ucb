import { Request, Response } from 'express';
import _ = require('underscore');
import { appLogger } from '../config/constants';
import Authentication from '../middlewares/authentication';


export class AuthController {
    public static login(req: Request, res: Response): void {
        let data = _.pick(req.body, ['name', 'password', 'keepSession', 'platform']);

        if(data.keepSession === true) {

        } else {

        }

        let session = Authentication.createSessionObject(data.name, data.platform);

        console.log(session);

        res.json({
            session: session.cipher
        });
    }

    public static logout(req: Request, res: Response): void {
        appLogger.info('Logout', 'logout request');
        res.json({
            ok: 'logout'
        });
    }
}
