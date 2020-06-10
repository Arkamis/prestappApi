
export interface IEnvConfig {
  secrets: {
    jwt: string;
  },
  mongo_uri: string;
  port: number | string;
}

