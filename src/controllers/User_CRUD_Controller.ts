import { Request, Response } from 'express';
import { CRUD_Controller } from '../interfaces/crudController';
import { PasswordHaher } from '../middlewares/passwordHashing';
import { appLogger } from '../config/constants';

export class UserCrudController extends CRUD_Controller {
    public create(req: Request<import("express-serve-static-core").ParamsDictionary, any, any, import("qs").ParsedQs>, res: Response<any>): void {
        appLogger.debug('Create User', '2', 'A new user has been created');
        req.body.password = PasswordHaher.saltHashPassword(req.body.password);
        
        res.json({
            message: 'POST /user request working',
            body: req.body
        });
    }

    public read(req: Request<import("express-serve-static-core").ParamsDictionary, any, any, import("qs").ParsedQs>, res: Response<any>): void {
        res.json({
            message: 'GET /user request working'
        });
    }

    public readOne(req: Request<import("express-serve-static-core").ParamsDictionary, any, any, import("qs").ParsedQs>, res: Response<any>): void {
        res.json({
            message: `GET /user/${req.params.id} request working`
        });
    }

    public update(req: Request<import("express-serve-static-core").ParamsDictionary, any, any, import("qs").ParsedQs>, res: Response<any>): void {
        res.json({
            message: 'PUT /user request working'
        });
    }

    public delete(req: Request<import("express-serve-static-core").ParamsDictionary, any, any, import("qs").ParsedQs>, res: Response<any>): void {
        res.json({
            message: 'DELETE /user request working'
        });
    }
}
