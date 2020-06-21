import { Document, Model, Schema, model } from "mongoose";
import { appLogger } from "../config/constants";


export enum PrivacyLevelEnum {
    PRIVATE,
    PUBLIC
};

declare interface IApp extends Document {
    name: string,
    description: string,
    apiKey: string,
    resourceFiles: string[],
    privacyLevel: PrivacyLevelEnum
}

export interface AppModel extends Model<IApp> {};


export class App {
    private _model: Model<IApp>;

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
            resourceFiles: {
                type: [String],
                default: []
            },
            privacyLevel: {
                type: PrivacyLevelEnum,
                default: PrivacyLevelEnum.PRIVATE
            }
        });

        this._model = model<IApp>('App', schema);
    }

    public get model(): Model<IApp> {
        appLogger.verbose('Database models', 'Creating app Model');
        return this._model;
    }
}