import { UserRouter } from "./userRouter";
import { RouterController } from '../interfaces/routerController';
import { Router } from 'express';
import { UserCrudController } from "../controllers/UserCrudController";
import { appLogger } from "../../config/constants";
import { DeviceRouter } from "./deviceRouter";
import { DeviceCrudController } from "../controllers/DeviceCrudController";
import { AppRouter } from "./appRouter";
import { AppCrudController } from "../controllers/AppCrudController";

export let router = Router();

let routes: Array<RouterController> = [];

routes.push(new UserRouter('users', router, new UserCrudController()));
routes.push(new DeviceRouter('devices', router, new DeviceCrudController()));
routes.push(new AppRouter('user-applications', router, new AppCrudController()));

appLogger.verbose('API router', 'Loading routes');


routes.forEach(routeController => {
    routeController.setupRoutes();
});

appLogger.verbose('API router', 'Router ready');
