import { HttpError } from "http-errors";

export interface IEnvConfig {
  mongo_uri: string;
  port: number | string;
  email_user: string;
  email_password: string;
}
export interface Secrets {
  jwtExp: string;
  jwtExpEmail: string;
  jwt: string;
}
export interface IBaseConfig {
  env: string;
  secrets: Secrets;
}
export interface Errorhttp extends HttpError{
  headers: {
    solucion: string;
  };
}
export interface Config extends IBaseConfig, IEnvConfig{}
