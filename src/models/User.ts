import { Document, Types, Model, Schema, model } from "mongoose";
import { appLogger } from "../config/constants";


interface Session {
    key: string,
    session: string,
    keep: boolean
}

declare interface IUser extends Document {
    name: string,
    email: string,
    password: string,
    salutation: string,
    apps: Types.ObjectId[],
    openSessions: Session[],
    devices: Types.ObjectId[],
    img: string,
    status: Boolean,
    role: string
}

export interface UserModel extends Model<IUser> {};


export class User {
    private _model: Model<IUser>;

    constructor () {
        const schema = new Schema({
            name:{
                type: String,
                required: [true, 'Name is required'],
                unique: true
            },
            email:{
                type: String,
                required: [true, 'email is required'],
                unique: true
            },
            password: {
                type: String,
                required: [true, 'Password is required']
            },
            salutation: {
                type: String
            },
            apps: {
                type: [Types.ObjectId],
                default: []
            },
            openSessions: {
                type: [Object],
                default: []
            },
            devices: {
                type: [Types.ObjectId],
                default: []
            },
            img: {
                type: String
            },
            status: {
                type: Boolean,
                default: false
            },
            role: {
                type: String,
                default: 'User'
            }
        });

        this._model = model<IUser>('User', schema);
    }

    public get model(): Model<IUser> {
        appLogger.verbose('Database models', 'Creating user Model');
        return this._model;
    }
}