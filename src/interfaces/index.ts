import { HttpError } from "http-errors";

export interface IEnvConfig {
  secrets: {
    jwtExp?: string;
    jwt: string;
    jwtExpEmail?: string;
  },
  mongo_uri: string;
  port: number | string;
  email_user: string;
  email_password: string;
}

export interface Errorhttp extends HttpError{
  headers: {
    solucion: string;
  };
}
