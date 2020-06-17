import { Document, Model, Schema, model } from "mongoose";


declare interface IDevice extends Document {
    name: string,
    apiKey: string
}

export interface DeviceModel extends Model<IDevice> {};


export class Device {
    private _model: Model<IDevice>;

    constructor () {
        const schema = new Schema({
            name:{
                type: String,
                required: [true, 'Name is required'],
                unique: true
            },
            apiKey:{
                type: String,
                required: [true, 'API key i required'],
                unique: true
            }
        });

        this._model = model<IDevice>('Device', schema);
    }

    public get model(): Model<IDevice> {
        return this._model;
    }
}