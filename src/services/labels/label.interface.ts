import { 
    Document, 
    Types
} from 'mongoose';
 
interface IlabelsDocument extends Document {
    _id: Types.ObjectId;
    name: string;
    color: string;
}

export interface ILabel extends IlabelsDocument {

}