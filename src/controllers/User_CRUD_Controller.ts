import { Request, Response } from 'express';
import { CRUD_Controller } from '../interfaces/crudController';

export class UserCrudController extends CRUD_Controller {
    public create(req: Request<import("express-serve-static-core").ParamsDictionary, any, any, import("qs").ParsedQs>, res: Response<any>): void {
        res.json({
            message: 'POST /user request working'
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
