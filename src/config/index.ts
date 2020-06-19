
import { merge } from 'lodash';
import { IEnvConfig, IBaseConfig, Config } from '../interfaces';

const env = process.env.NODE_ENV || 'development';

const baseConfig: IBaseConfig = {
  env,
  secrets: {
    jwtExp: '30d',
    jwtExpEmail: '15d',
    jwt: process.env.JWT_SECRET as string
  }
}

let envConfig: IEnvConfig;

switch (env) {
  case 'dev':
  case 'development':
    envConfig = require('./dev').config
    break
  case 'prod':
  case 'production':
    envConfig = require('./prod').config
    break
  default:
    envConfig = require('./dev').config

}
const config:Config = merge(baseConfig, envConfig);
export default config;