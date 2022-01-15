import Env from '@ioc:Adonis/Core/Env'

export default Env.rules({
  // App
  HOST: Env.schema.string(),
  PORT: Env.schema.number(),
  APP_KEY: Env.schema.string(),
  APP_NAME: Env.schema.string(),
  NODE_ENV: Env.schema.enum(['development', 'production', 'testing'] as const),
  BASE_URL: Env.schema.string(),
  API_VERSION: Env.schema.string(),

  // Utils
  DISCORD_ID: Env.schema.string(),
  GITHUB_TOKEN: Env.schema.string(),
  GITHUB_SOURCE: Env.schema.string({ format: 'url' }),
  GITHUB_USERNAME: Env.schema.string(),

  // Redis
  REDIS_CONNECTION: Env.schema.enum(['local'] as const),
  REDIS_HOST: Env.schema.string(),
  REDIS_PORT: Env.schema.number(),
  REDIS_DB: Env.schema.number(),
  REDIS_PASSWORD: Env.schema.string.optional(),

  // Mysql
  DB_CONNECTION: Env.schema.string(),
  MYSQL_HOST: Env.schema.string(),
  MYSQL_PORT: Env.schema.number(),
  MYSQL_USER: Env.schema.string(),
  MYSQL_PASSWORD: Env.schema.string.optional(),
  MYSQL_DB_NAME: Env.schema.string(),

  // Session
  SESSION_DRIVER: Env.schema.string(),

  // Views
  CACHE_VIEWS: Env.schema.boolean(),

  // Mails
  SMTP_HOST: Env.schema.string({ format: 'host' }),
  SMTP_PORT: Env.schema.number(),
  SMTP_USERNAME: Env.schema.string(),
  SMTP_PASSWORD: Env.schema.string(),

  // Wakatime
  WAKATIME_USER: Env.schema.string(),
  WAKATIME_KEY: Env.schema.string(),
  WAKATIME_ID: Env.schema.string(),

  // Spotify
  SPOTIFY_ID: Env.schema.string(),
  SPOTIFY_SECRET: Env.schema.string(),
})
