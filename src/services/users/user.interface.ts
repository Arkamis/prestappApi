import { 
    Types,
    Document,
    Model
} from "mongoose";

export interface IUser extends Document {
    _id: Types.ObjectId;
    firstName: string;
    lastName: string;
    phone?: string;
    email: string;
    password: string;
    tokens:[string];
    fullName: string;
    generateAuthToken():  Promise<string>;
    toJSON(): Object;
}
export interface IUserModel extends Model < IUser > {
    findByCredentials(email: string, password: string): IUser;
}