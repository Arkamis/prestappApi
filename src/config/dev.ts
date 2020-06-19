import { IEnvConfig } from '../interfaces';

export const config: IEnvConfig = {
    mongo_uri: process.env.MONGO_URI as string,
    port : 5001,
    email_user: process.env.USER_EMAIL as string,
    email_password: process.env.USER_EMAIL_PASSWORD as string
}