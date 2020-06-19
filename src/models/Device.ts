import { Document, Model, Schema, model } from "mongoose";
import { appLogger } from "../config/constants";


declare interface IDevice extends Document {
    name: string,
    description: string,
    apiKey: string
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
                required: [true, 'API key i required']
            }
        });

        this._model = model<IDevice>('Device', schema);
    }

    public get model(): Model<IDevice> {
        appLogger.verbose('Database models', 'Creating device Model');
        return this._model;
    }
}