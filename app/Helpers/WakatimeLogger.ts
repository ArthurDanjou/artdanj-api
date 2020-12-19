import axios from "axios";
import Env from '@ioc:Adonis/Core/Env'

async function login() {
  await axios.post("https://wakatime.com/oauth/token",
    {
      client_id: Env.get('WAKATIME_USERNAME'),
      client_secret: Env.get('WAKATIME_PASSWORD')
    },
    {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    })
}

export { login }
