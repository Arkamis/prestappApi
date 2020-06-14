
export interface IEnvConfig {
  secrets: {
    jwt: string;
  },
  mongo_uri: string;
  port: number | string;
  email_user: string;
  email_password: string;
}

