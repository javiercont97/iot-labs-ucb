import { UserRouter } from "./userRouter";
import { RouterController } from '../../interfaces/routerController';
import { Router } from 'express';
import { UserCrudController } from "../../controllers/User_CRUD_Controller";

export const router = Router();

let routes: Array<RouterController> = [];

routes.push( new UserRouter( 'users', router, new UserCrudController() ));


routes.forEach(routeController => {
    routeController.setupRoutes();
});
