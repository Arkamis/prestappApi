import { IEnvConfig } from '../interfaces';

export const config: IEnvConfig = {
    secrets: {
        jwt: 'stringExample'
    },
    mongo_uri: process.env.MONGO_URI as string,
    port : 3000
}