import { CRUD_Controller } from "./crudController";
import express = require('express');

export abstract class RouterController {
    public router: express.Router;
    public crud: CRUD_Controller;

    public abstract setupRoutes ();
}
