import { Document, Types, Model, Schema, model } from "mongoose";


declare interface IUser extends Document {
    name: String,
    email: String,
    password: String,
    salutation: String,
    apps: Types.ObjectId[],
    openSessions: Types.ObjectId[],
    img: String,
    status: Boolean,
    role: String
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
                required: [true, 'email i required'],
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
                type: [Types.ObjectId],
                default: []
            },
            img: {
                type: String
            },
            status: {
                type: Boolean,
                default: true
            },
            role: {
                type: String,
                default: 'User'
            }
        });

        this._model = model<IUser>('User', schema);
    }

    public get model(): Model<IUser> {
        return this._model;
    }
}