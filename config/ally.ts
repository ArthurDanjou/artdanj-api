/**
 * Config source: https://git.io/JOdi5
 *
 * Feel free to let us know via PR, if you find something broken in this config
 * file.
 */

import Env from '@ioc:Adonis/Core/Env'
import {AllyConfig} from '@ioc:Adonis/Addons/Ally'

/*
|--------------------------------------------------------------------------
| Ally Config
|--------------------------------------------------------------------------
|
| The `AllyConfig` relies on the `SocialProviders` interface which is
| defined inside `contracts/ally.ts` file.
|
*/
const allyConfig: AllyConfig = {
  /*
  |--------------------------------------------------------------------------
  | Github driver
  |--------------------------------------------------------------------------
  */
  github: {
    driver: 'github',
    clientId: Env.get('GITHUB_CLIENT_ID'),
    clientSecret: Env.get('GITHUB_CLIENT_SECRET'),
    callbackUrl: `${Env.get('ALLY_CALLBACK_URL')}/github`,
  },
  /*
  |--------------------------------------------------------------------------
  | Google driver
  |--------------------------------------------------------------------------
  */
  google: {
    driver: 'google',
    clientId: Env.get('GOOGLE_CLIENT_ID'),
    clientSecret: Env.get('GOOGLE_CLIENT_SECRET'),
    callbackUrl: `${Env.get('ALLY_CALLBACK_URL')}/google`,
  },
  /*
  |--------------------------------------------------------------------------
  | Twitter driver
  |--------------------------------------------------------------------------
  */
  twitter: {
    driver: 'twitter',
    clientId: Env.get('TWITTER_CLIENT_ID'),
    clientSecret: Env.get('TWITTER_CLIENT_SECRET'),
    callbackUrl: `${Env.get('ALLY_CALLBACK_URL')}/twitter`,
  },
  /*
  |--------------------------------------------------------------------------
  | Discord driver
  |--------------------------------------------------------------------------
  */
  discord: {
    driver: 'discord',
    clientId: Env.get('DISCORD_CLIENT_ID'),
    clientSecret: Env.get('DISCORD_CLIENT_SECRET'),
    callbackUrl: `${Env.get('ALLY_CALLBACK_URL')}/discord`,
  },
}

export default allyConfig
