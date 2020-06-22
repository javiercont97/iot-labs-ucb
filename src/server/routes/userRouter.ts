/********************************************
 *
 *	@file:			userRouter.ts
 *	@module:		routes
 *
 *	@author:		Javier Mauricio Contreras Guzman
 *
 *	@description:	User related operations router
 *
 *******************************************/

import { Request, Response } from 'express';
import { UserCrudController } from "../controllers/UserCrudController";
import { RouterController } from '../interfaces/routerController';
import { Router } from 'express';
import { UserValidator } from '../middlewares/userValidator';
import { AuthController } from '../controllers/authController';
import { appLogger } from '../../config/constants';
import Authentication from '../middlewares/authentication';
import Authorization from '../middlewares/authorization';

export class UserRouter implements RouterController {
    public router: Router;
    public crud: UserCrudController;
    public baseUrl: String;

    constructor (baseUrl: String, router: Router, crud: UserCrudController){
        this.router = router;
        this.crud = crud;
        this.baseUrl = baseUrl;
    }

    setupRoutes() {
        appLogger.verbose('User router', `POST /${this.baseUrl}`);
        this.router.post(`/${this.baseUrl}`, [UserValidator.checkFields, UserValidator.validateFirstAdminCreation], (req: Request, res: Response) => {
            this.crud.create(req, res);
        });

        appLogger.verbose('User router', `GET /${this.baseUrl}`);
        this.router.get(`/${this.baseUrl}`, [Authentication.verifySessionActive], (req: Request, res: Response) => {
            this.crud.read(req, res);
        });

        appLogger.verbose('User router', `GET /${this.baseUrl}/:id`);
        this.router.get(`/${this.baseUrl}/:id`, [Authentication.verifySessionActive, Authorization.verifyAccountOwnership], (req: Request, res: Response) => {
            this.crud.readOne(req, res);
        });

        appLogger.verbose('User router', `PUT /${this.baseUrl}/:id`);
        this.router.put(`/${this.baseUrl}/:id`, [Authentication.verifySessionActive, Authorization.verifyAccountOwnership], (req: Request, res: Response) => {
            this.crud.update(req, res);
        });

        appLogger.verbose('User router', `DELETE /${this.baseUrl}/:id`);
        this.router.delete(`/${this.baseUrl}/:id`, [Authentication.verifySessionActive, Authorization.verifyAccountOwnership], (req: Request, res: Response) => {
            this.crud.delete(req, res);
        });

        appLogger.verbose('User router', `POST /login`);
        this.router.post(`/login`, (req: Request, res: Response) => {
            AuthController.login(req, res);
        });

        appLogger.verbose('User router', `POST /logout`);
        this.router.post(`/logout`, [Authentication.verifySessionActive], (req: Request, res: Response) => {
            AuthController.logout(req, res);
        });

        appLogger.verbose('User router', 'GET /activate-user');
        this.router.get('/activate-user', (req: Request, res: Response) => {
            AuthController.activateUser(req, res);
        });
    }
}
