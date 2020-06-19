import { 
  Schema,
  model
 } from "mongoose";
import { IPayment } from "./payment.interface";

const lessThanOneHourAgo = (date: number) => {
  const HOUR = 1000 * 60 * 60;
  const anHourAgo = Date.now() - HOUR;

  return date > anHourAgo;
}
const paymentSchema = new Schema({
  amount: {
    type: Number,
    min: 1,
    max: 20000
  },
  paidAt: {
    type: Date,
    validate: lessThanOneHourAgo
  },
  paymentReceipts: [String],
  status: {
    type: String,
    set: (val: string) => {
      return val.toLowerCase();
    },
    lowercase: true,
    default: "active",
    enum: ['pending', 'complete', 'active']
  },
  owner: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: "User"
  },
  debtor: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: "User"
  },
  debt: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: "Debt",
  }

});

export const Payment = model<IPayment>('Payment', paymentSchema);