import { UserRouter } from "./userRouter";
import { RouterController } from '../interfaces/routerController';
import { Router } from 'express';
import { UserCrudController } from "../controllers/UserCrudController";
import { appLogger } from "../../config/constants";
import { DeviceRouter } from "./deviceRouter";
import { DeviceCrudController } from "../controllers/DeviceCrudController";

export let router = Router();

let routes: Array<RouterController> = [];

routes.push(new UserRouter('users', router, new UserCrudController()));
routes.push(new DeviceRouter('devices', router, new DeviceCrudController()));

appLogger.verbose('API router', 'Loading routes');


routes.forEach(routeController => {
    routeController.setupRoutes();
});

appLogger.verbose('API router', 'Router ready');
