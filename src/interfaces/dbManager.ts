import { UserModel, User } from "../models/User";
import { DeviceModel, Device } from "../models/Device";
import { AppModel, App } from "../models/App";

import { Connection, connect, connection } from "mongoose";
import { MONGO_URI, appLogger } from "../config/constants";

declare interface IModels {
    User: UserModel,
    Device: DeviceModel,
    App: AppModel
}

export class DB {
    private static instance: DB;

    private _db: Connection;
    private _models: IModels;

    private constructor() {
        connect( MONGO_URI, {useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true, useFindAndModify: false});

        appLogger.verbose('Database', 'Connecting DB server');

        this._db = connection;
        this._db.on('open', this.connected);
        this._db.on('error', this.error);

        appLogger.verbose('Database', 'Loading DB models');
        this._models = {
            User: new User().model,
            Device: new Device().model,
            App: new App().model
        }
    }

    public static get Models() {
        if(!DB.instance) {
            DB.instance = new DB();
        }
        return DB.instance._models;
    }

    private connected(){
        appLogger.info('Database', 'Database connected')
    }

    private error (error) {
        appLogger.error('Database', JSON.stringify(error));
    }
}


DB.Models;