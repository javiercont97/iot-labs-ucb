import { UserModel, User } from "../models/User";
import { Connection, connect, connection } from "mongoose";
import { MONGO_URI, appLogger } from "../config/constants";

declare interface IModels {
    User: UserModel;
}

export class DB {
    private static instance: DB;

    private _db: Connection;
    private _models: IModels;

    private constructor() {
        connect( MONGO_URI, {useNewUrlParser: true});
        this._db = connection;
        this._db.on('open', this.connected);
        this._db.on('error', this.error);

        this._models = {
            User: new User().model
        }
    }

    private static get Models() {
        if(!DB.instance) {
            DB.instance = new DB();
        }
        return DB.instance._models;
    }

    private connected(){
        appLogger.debug('Database', '1', 'Database ONLINE')
    }

    private error (error) {
        appLogger.error('Database', '0x01', error);
    }
}