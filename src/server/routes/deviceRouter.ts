/********************************************
 *
 *	@file:			deviceRouter.ts
 *	@module:		routes
 *
 *	@author:		Javier Mauricio Contreras Guzman
 *
 *	@description:	Device related operations router
 *
 *******************************************/

import { Request, Response } from 'express';
import { DeviceCrudController } from '../controllers/DeviceCrudController';
import { RouterController } from '../interfaces/routerController';
import { Router } from 'express';
import { CRUD_Controller } from '../interfaces/crudController';
import { appLogger } from '../../config/constants';
import Authentication from '../middlewares/authentication';
import Authorization from '../middlewares/authorization';

export class DeviceRouter implements RouterController {
    public router: Router;
    public crud: CRUD_Controller;
    public baseUrl: String;

    constructor (basesUrl: String, router: Router, crud: DeviceCrudController) {
        this.router = router;
        this.crud = crud;
        this.baseUrl = basesUrl;
    }

    public setupRoutes() {
        appLogger.verbose('Device router', `POST /${this.baseUrl}`);
        this.router.post(`/${this.baseUrl}`, [Authentication.verifySessionActive], (req: Request, res: Response) => {
            this.crud.create(req, res);
        });

        appLogger.verbose('Device router', `GET /${this.baseUrl}`);
        this.router.get(`/${this.baseUrl}`, [Authentication.verifySessionActive], (req: Request, res: Response) => {
            this.crud.read(req, res);
        });

        appLogger.verbose('Device router', `GET /${this.baseUrl}/:id`);
        this.router.get(`/${this.baseUrl}/:id`, [Authentication.verifySessionActive, Authorization.verifyDeviceOwnership], (req: Request, res: Response) => {
            this.crud.readOne(req, res);
        });

        appLogger.verbose('Device router', `PUT /${this.baseUrl}/:id`);
        this.router.put(`/${this.baseUrl}/:id`, [Authentication.verifySessionActive, Authorization.verifyDeviceOwnership], (req: Request, res: Response) => {
            this.crud.update(req, res);
        });

        appLogger.verbose('Device router', `DELETE /${this.baseUrl}/:id`);
        this.router.delete(`/${this.baseUrl}/:id`, [Authentication.verifySessionActive, Authorization.verifyDeviceOwnership], (req: Request, res: Response) => {
            this.crud.delete(req, res);
        });
    }
}