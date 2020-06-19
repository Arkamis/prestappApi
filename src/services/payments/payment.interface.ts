import {
    Document, 
    Types
} from 'mongoose';

interface IPaymentDocument extends Document {
    _id: Types.ObjectId;
    amount?: number;
    paidAt?: Date;
    paymentReceipts?: [string];
    status?: string;
    owner: Types.ObjectId;
    debtor: Types.ObjectId;
    debt: Types.ObjectId;
}

export interface updatePaymentMask {
    amount: number;
    paymentReceipts:[];
}

export interface IPayment extends IPaymentDocument{
    
}
