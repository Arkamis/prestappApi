import { 
    Types,
    Document,
    Model
} from "mongoose";
import { IPayment } from "../payments/payment.interface";
import { IDebt } from "../debts/debt.interface";

export interface userUpdateMask {
    firstName?: string;
    lastName?: string;
    phone?: string;
    emailAsDebtor?: string;
}
export interface createUserMask {
    firstName: string;
    lastName: string;
    phone?: string;
    emailAsDebtor?: string;
    email?: string;
    rol: undefined;
}
interface IUserDocument extends Document {
    owner?: Types.ObjectId;
    firstName: string;
    lastName: string;
    phone: string;
    email?: string;
    emailAsDebtor?: string;
    password: string;
    tokens:[string];
    fullName?: string;
    payments?:[IPayment];
    debts?:[IDebt];
    isEmailVerified?: boolean;
    clients?: [IUser];
    rol: string;
}
export interface IUser extends IUserDocument {
    generateAuthToken():  Promise<string>;
    toJSON(): Object;
    checkPassword(password: string): Promise<boolean>;
}
export interface IUserModel extends Model < IUser > {
    findByCredentials(email: string, password: string): IUser;
}