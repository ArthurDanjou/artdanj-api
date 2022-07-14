import { btoa } from 'buffer'
import axios from 'axios'
import Env from '@ioc:Adonis/Core/Env'
import Redis from '@ioc:Adonis/Addons/Redis'
import Logger from '@ioc:Adonis/Core/Logger'
import type { StatesResponse } from 'App/Types/IStates'

export async function fetchDevelopingState(): Promise<void> {
  try {
    const response = await axios.get<{ data: StatesResponse[] }>(`https://wakatime.com/api/v1/users/${Env.get('WAKATIME_USER')}/heartbeats`, {
      headers: {
        Authorization: `Basic ${btoa(Env.get('WAKATIME_KEY'))}`,
      },
      params: {
        date: new Date(),
      },
    })

    if (response.status === 200) {
      const heartbeat = response.data.data[response.data.data.length - 1]
      const current_time = new Date(Date.now()).getTime() / 1000

      if (heartbeat && heartbeat.time!) {
        const active = current_time - heartbeat.time <= 60 * 5 // Less than 5 min.
        const redis_state = await Redis.get('states:developing') === 'true'

        if (redis_state !== active) {
          await Redis.set('states:developing', String(active))
          if (redis_state)
            await Redis.set('states:sleeping', 'false')
        }
      }
    }
  }
  catch (error) {
    Logger.error('Error while getting the states')
  }
}
