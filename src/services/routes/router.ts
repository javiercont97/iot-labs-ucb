import { UserRouter } from "./userRouter";
import { RouterController } from '../../interfaces/routerController';
import { Router } from 'express';
import { UserCrudController } from "../../controllers/User_CRUD_Controller";
import { appLogger } from "../../config/constants";

export let router = Router();

let routes: Array<RouterController> = [];

routes.push( new UserRouter( 'users', router, new UserCrudController() ));

appLogger.verbose('API router', 'Loading routes');


routes.forEach(routeController => {
    routeController.setupRoutes();
});

appLogger.verbose('API router', 'Router ready');
