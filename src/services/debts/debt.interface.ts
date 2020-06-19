import { 
    Types,
    Model,
    Document
} from "mongoose";
import { IPayment } from "../payments/payment.interface";
// import { ILabel } from "../labels/label.interface";

interface IDebtDocument extends Document{
    _id: Types.ObjectId;
    owner: Types.ObjectId;
    debtor: Types.ObjectId;
    title: string;
    description: string;
    totalAmount: number;
    startDueDate: Date;
    estimatedDueDate: Date;
    numberOfPayments?: number;
    paymentFrecuency?: string;
    labels?: Array<string>;
    isActive: boolean;
    payments:[IPayment];
    isNotificationActive?:[boolean];
}

export interface IDebtUpdateReq {
    title: string;
    description: string;
    labels: Array<string>;
}
export interface IDebt extends IDebtDocument {
    //declare Document functions here
}

export interface IDebtModel extends Model < IDebt > {
    //Declare model functions here
}