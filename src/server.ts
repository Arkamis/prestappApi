import express, 
{ 
    Application, 
    json, 
    urlencoded 
} from "express";
import cors from "cors";
import morgan from 'morgan';
import helmet from 'helmet';
import compression from 'compression';
import dotenv from 'dotenv';
dotenv.config();

import config from "./config";
import { connection } from './utils/db';

//routes
import  userRouter from "./services/users/user.routes";
// import { skip, stream } from './utils';

const app: Application = express();

app.use(compression());
app.use(cors());
app.use(helmet());
app.use(json());
app.use(urlencoded({ extended: false }));
app.use(morgan('dev'));


app.use('/api/users', userRouter);

export const start = async () => {
    try {
        await connection()
        app.listen(config.port, () => {
        console.log('🚀Server is listenning on port:', config.port);
        })
    } catch (e) {
        console.error(e)
        return process.exit(1);
    }
}