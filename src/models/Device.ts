import { Document, Model, Schema, model, Types } from "mongoose";
import { appLogger } from "../config/constants";


declare interface IDevice extends Document {
    name: string,
    description: string,
    apiKey: string,
    app: Types.ObjectId
}

export interface DeviceModel extends Model<IDevice> {};


export class Device {
    private _model: Model<IDevice>;

    constructor () {
        const schema = new Schema({
            name:{
                type: String,
                required: [true, 'Name is required']
            },
            description: {
                type: String,
                required: [true, 'Description is required'],
                default: ''
            },
            apiKey:{
                type: String,
                required: [true, 'API key is required']
            },
            app: {
                type: Types.ObjectId,
                required: false
            }
        });

        this._model = model<IDevice>('Device', schema);
    }

    public get model(): Model<IDevice> {
        appLogger.verbose('Database models', 'Creating device Model');
        return this._model;
    }
}