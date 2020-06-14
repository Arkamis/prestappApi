import { IEnvConfig } from '../interfaces';

export const config: IEnvConfig = {
    secrets: {
        jwt: process.env.JWT_SECRET as string
    },
    mongo_uri: process.env.MONGO_URI as string,
    port: process.env.PORT as string | number,
    email_user: process.env.USER_EMAIL as string,
    email_password: process.env.USER_EMAIL_PASSWORD as string
}