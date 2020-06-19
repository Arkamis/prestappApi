import {
    model,
    Schema,
    Types
} from 'mongoose';
import { ILabel } from './label.interface';

const labelSchema = new Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    color: {
        type: String,
        required: true,
        trim: true,
        validate: (val: string) => /^#[0-9A-Z]{6}$/i.test(val)
    }
})

export const Label = model<ILabel>("Label", labelSchema);
