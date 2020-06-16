
import { merge } from 'lodash';
import { IEnvConfig } from '../interfaces';

const env = process.env.NODE_ENV || 'development';

const baseConfig = {
  env,
  isDev: env === 'development',
  isTest: env === 'testing',
  secrets: {
    jwtExp: '30d',
    jwtExpEmail: '15d'
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

export default merge(baseConfig, envConfig)