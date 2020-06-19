import { Schema, model } from 'mongoose';
import { IDebt } from './debt.interface';

const debtSchema =  new Schema({
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
  description:{
    type: String,
    required: true,
    minlength: 4,
    maxlength: 250
  },
  totalAmount: {
    type: Number,
    required: true,
    min: 500
  },
  startDueDate: {
    type: Date,
    required: false,
    default: Date.now()
  },
  estimatedDueDate: {
    type: Date,
    required: false,
    min: Date.now()
  },
  paymentFrecuency: {
    type: String,
    lowercase: true,
    enum: ['semanal', 'quincenal', 'mensual'],
    trim: true
  },
  labels: [String],
  isActive: {
    type: Boolean,
    default: true,
    required: true
  },
  isNotificationActive: Boolean
},{
  versionKey: false,
  timestamps: true
});

// debtSchema.virtual('payments', {
//   ref: 'User',
//   localField: '_id',
//   foreingField: ''
// })

export const Debt = model< IDebt >('Debt', debtSchema);
