import { IEnvConfig } from '../interfaces';

export const config: IEnvConfig = {
    secrets: {
        jwt: process.env.JWT_SECRET as string
    },
    mongo_uri: process.env.MONGO_URI as string,
    port : 5001
}