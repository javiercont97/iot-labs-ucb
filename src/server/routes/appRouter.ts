/********************************************
 *
 *	@file:			appRouter.ts
 *	@module:		routes
 *
 *	@author:		Javier Mauricio Contreras Guzman
 *
 *	@description:	App related operations router
 *
 *******************************************/

import { Request, Response } from 'express';
import { AppCrudController } from '../controllers/AppCrudController';
import { RouterController } from '../interfaces/routerController';
import { Router } from 'express';
import { CRUD_Controller } from '../interfaces/crudController';
import { appLogger } from '../../config/constants';
import Authentication from '../middlewares/authentication';
import Authorization from '../middlewares/authorization';
import { FileValidator } from '../middlewares/fileValidator';

export class AppRouter implements RouterController {
    public router: Router;
    public crud: CRUD_Controller;
    public baseUrl: String;

    constructor (baseUrl: String, router: Router, crud: AppCrudController) {
        this.router = router;
        this.crud = crud;
        this.baseUrl = baseUrl;
    }

    public setupRoutes() {
        appLogger.verbose('App router', `POST /${this.baseUrl}`);
        this.router.post(`/${this.baseUrl}`, [Authentication.verifySessionActive, FileValidator.verifyFileExistance, FileValidator.verifyFileExtention, FileValidator.verifyFileSize], (req: Request, res: Response) => {
            this.crud.create(req, res);
        });

        appLogger.verbose('App router', `GET /${this.baseUrl}`);
        this.router.get(`/${this.baseUrl}`, [Authentication.verifySessionActive], (req: Request, res: Response) => {
            this.crud.read(req, res);
        });

        appLogger.verbose('App router', `GET /${this.baseUrl}/:id`);
        this.router.get(`/${this.baseUrl}/:id`, [Authentication.verifySessionActive, Authorization.verifyAppOwnership], (req: Request, res: Response) => {
            this.crud.readOne(req, res);
        });

        appLogger.verbose('App router', `PUT /${this.baseUrl}/:id`);
        this.router.put(`/${this.baseUrl}/:id`, [Authentication.verifySessionActive, Authorization.verifyAppOwnership], (req: Request, res: Response) => {
            this.crud.update(req, res);
        });

        appLogger.verbose('App router', `DELETE /${this.baseUrl}/:id`);
        this.router.delete(`/${this.baseUrl}/:id`, [Authentication.verifySessionActive, Authorization.verifyAppOwnership], (req: Request, res: Response) => {
            this.crud.delete(req, res);
        });
    }

}