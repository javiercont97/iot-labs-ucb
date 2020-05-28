import { Document, Types, Model, Schema } from "mongoose";


export interface IUser extends Document {
    name: String,
    email: String,
    password: String,
    salutation: String,
    apps: Types.ObjectId[],
    openSessions: Types.ObjectId[],
    img: String,
    status: Boolean
}

export interface UserModel extends Model<IUser> {};


export class User {
    private _model: Model<IUser>;

    constructor () {
        const schema = new Schema({
            name:{
                type: String,
                required: [true, 'Name is required']
            },
            email:{
                type: String,
                required: [true, 'email i required']
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
                type: [Types.ObjectId],
                default: []
            },
            img: {
                type: String
            },
            status: {
                type: Boolean,
                default: true
            }
        });
    }

    public get model(): Model<IUser> {
        return this._model;
    }
}