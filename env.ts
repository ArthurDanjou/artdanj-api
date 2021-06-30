/*
|--------------------------------------------------------------------------
| Validating Environment Variables
|--------------------------------------------------------------------------
|
| In this file we define the rules for validating environment variables.
| By performing validation we ensure that your application is running in
| a stable environment with correct configuration values.
|
| This file is read automatically by the framework during the boot lifecycle
| and hence do not rename or move this file to a different location.
|
*/

import Env from '@ioc:Adonis/Core/Env'

export default Env.rules({

  //App
  HOST: Env.schema.string(),
	PORT: Env.schema.number(),
	APP_KEY: Env.schema.string(),
	APP_NAME: Env.schema.string(),
	NODE_ENV: Env.schema.enum(['development', 'production', 'testing'] as const),

  //Redis
  REDIS_CONNECTION: Env.schema.enum(['local'] as const),
  REDIS_HOST: Env.schema.string(),
  REDIS_PORT: Env.schema.number(),
  REDIS_DB: Env.schema.number(),
  REDIS_PASSWORD: Env.schema.string.optional(),

  //Mysql
  DB_CONNECTION: Env.schema.string(),
  MYSQL_HOST: Env.schema.string(),
  MYSQL_PORT: Env.schema.number(),
  MYSQL_USER: Env.schema.string(),
  MYSQL_PASSWORD: Env.schema.string.optional(),
  MYSQL_DB_NAME: Env.schema.string(),

  //Session
  SESSION_DRIVER: Env.schema.string(),

  //Views
  CACHE_VIEWS: Env.schema.boolean(),

  //Utils
  GITHUB_TOKEN: Env.schema.string(),
  GITHUB_SOURCE: Env.schema.string({ format: 'url' }),
  BASE_URL: Env.schema.string(),
  API_VERSION: Env.schema.string(),

  //Mails
  SMTP_HOST: Env.schema.string({ format: 'host' }),
  SMTP_PORT: Env.schema.number(),
  SMTP_USERNAME: Env.schema.string(),
  SMTP_PASSWORD: Env.schema.string(),

  //Socials Authentication
  GOOGLE_CLIENT_ID: Env.schema.string(),
  GOOGLE_CLIENT_SECRET: Env.schema.string(),

  TWITTER_CLIENT_ID: Env.schema.string(),
  TWITTER_CLIENT_SECRET: Env.schema.string(),

  GITHUB_CLIENT_ID: Env.schema.string(),
  GITHUB_CLIENT_SECRET: Env.schema.string(),
})
