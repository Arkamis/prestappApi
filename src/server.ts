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
import  debtRouter from "./services/debts/debt.routes";
import  paymentRouter from "./services/payments/payment.routes";
import {errorHandler}  from "./utils/errorHandling";
import { 
    protect, 
    authenticateUser, 
    registerUser, 
    logout,
    verifyEmail
} from "./utils/auth";
// import { skip, stream } from './utils';

const app: Application = express();

app.use(compression());
app.use(cors());
app.use(helmet());
app.use(json());
app.use(urlencoded({ extended: false }));
app.use(morgan('dev'));


app.post('/signup', registerUser)
app.post('/signin', authenticateUser)
app.get('/confirmation/:token', verifyEmail);

app.use('/api', protect)
app.use('/api/user', userRouter);
app.use('/api/debt', debtRouter);
app.use('/api/payment', paymentRouter);
app.get('/api/logout', logout);

app.use(errorHandler);
//needs 404 route not found handler

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