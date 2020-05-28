import { Request, Response } from 'express';
import { UserCrudController } from "../../controllers/User_CRUD_Controller";
import { RouterController } from '../../interfaces/routerController';
import { Router } from 'express';
import { UserValidator } from '../../middlewares/userValidator';

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
        this.router.post(`/${this.baseUrl}`, UserValidator.checkFields, (req: Request, res: Response) => {
            this.crud.create(req, res);
        });

        this.router.get(`/${this.baseUrl}`, (req: Request, res: Response) => {
            this.crud.read(req, res);
        });

        this.router.get(`/${this.baseUrl}/:id`, (req: Request, res: Response) => {
            this.crud.readOne(req, res);
        });

        this.router.put(`/${this.baseUrl}/:id`, (req: Request, res: Response) => {
            this.crud.update(req, res);
        });

        this.router.delete(`/${this.baseUrl}/:id`, (req: Request, res: Response) => {
            this.crud.delete(req, res);
        });
    }
}
