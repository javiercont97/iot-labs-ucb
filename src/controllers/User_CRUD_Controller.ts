import { Request, Response } from 'express';
import { CRUD_Controller } from '../interfaces/crudController';
import { PasswordHaher } from '../middlewares/passwordHashing';
import { appLogger } from '../config/constants';
import { DB } from '../interfaces/dbManager';

export class UserCrudController extends CRUD_Controller {
    public create(req: Request<import("express-serve-static-core").ParamsDictionary, any, any, import("qs").ParsedQs>, res: Response<any>): void {
        // Hash password
        req.body.password = PasswordHaher.saltHashPassword(req.body.password);

        let user = new DB.Models.User(req.body);

        appLogger.debug('CRUD User (Create)', '3', JSON.stringify(req.body));

        user.save((err, userDB) => {
            if (err) {
                appLogger.debug('CRUD User (Create)', '2', 'Database error while creating a user');
                return res.status(500).json({
                    err: {
                        errorCode: '0x0c',
                        message: err
                    }
                });
            } else {
                appLogger.debug('CRUD User (Create)', '2', 'A new user has been created');
                return res.json({
                    message: `User created successfully (ID=${userDB.id})`
                });
            }
        });
    }

    public read(req: Request<import("express-serve-static-core").ParamsDictionary, any, any, import("qs").ParsedQs>, res: Response<any>): void {
        appLogger.debug('CRUD User (Read)', '2', 'GET users/');
        res.status(501).json({
            err: {
                errorCode: "0x07",
                message: "Route callback unimplemented"
            }
        });
    }

    public readOne(req: Request<import("express-serve-static-core").ParamsDictionary, any, any, import("qs").ParsedQs>, res: Response<any>): void {
        let id = req.params.id;
        appLogger.debug('CRUD User (Read one)', '3', JSON.stringify({id, data: req.body}));

        DB.Models.User.findById(id, 'name email salutation apps img role', (err, userDB) => {
            if (err) {
                appLogger.debug('CRUD User (Read one)', '2', 'Database error while reading a user');
                res.status(404).json({
                    err: {
                        errorCode: "0x0d",
                        message: err
                    }
                });
            } else {
                appLogger.debug('CRUD User (Read one)', '2', 'A user has been retrieved');
                return res.json({
                    user: userDB
                });
            }
        });
    }

    public update(req: Request<import("express-serve-static-core").ParamsDictionary, any, any, import("qs").ParsedQs>, res: Response<any>): void {
        let id = req.params.id;
        appLogger.debug('CRUD User (Read one)', '3', JSON.stringify({id, data: req.body}));

        DB.Models.User.findByIdAndUpdate(id, req.body, (err, userDB) => {
            if (err) {
                appLogger.debug('CRUD User (Read one)', '2', 'Database error while updating a user');
                res.status(404).json({
                    err: {
                        errorCode: "0x0e",
                        message: err
                    }
                });
            } else {
                appLogger.debug('CRUD User (Read one)', '2', 'A user has been updated');
                return res.json({
                    message: 'User updated successfully'
                });
            }
        });
    }

    public delete(req: Request<import("express-serve-static-core").ParamsDictionary, any, any, import("qs").ParsedQs>, res: Response<any>): void {
        let id = req.params.id;
        appLogger.debug('CRUD User (Read one)', '3', JSON.stringify({id, data: req.body}));

        DB.Models.User.findByIdAndUpdate(id, {status: false}, (err, userDB) => {
            if (err) {
                appLogger.debug('CRUD User (Read one)', '2', 'Database error while deleting a user');
                res.status(404).json({
                    err: {
                        errorCode: "0x0f",
                        message: err
                    }
                });
            } else {
                appLogger.debug('CRUD User (Read one)', '2', 'A user has been deleted');
                return res.json({
                    message: 'User deleted successfully'
                });
            }
        });
    }
}
