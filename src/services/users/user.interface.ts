import { 
    Types,
    Document,
    Model
} from "mongoose";

interface IUserDocument extends Document {
    _id: Types.ObjectId;
    firstName: string;
    lastName: string;
    phone?: string;
    email: string;
    password: string;
    tokens:[string];
    fullName: string;
}
export interface IUser extends IUserDocument {
    generateAuthToken():  Promise<string>;
    toJSON(): Object;
}
export interface IUserModel extends Model < IUser > {
    findByCredentials(email: string, password: string): IUser;
}