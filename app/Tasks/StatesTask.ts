import { btoa } from 'buffer'
import axios from 'axios'
import Env from '@ioc:Adonis/Core/Env'
import Logger from '@ioc:Adonis/Core/Logger'
import Redis from '@ioc:Adonis/Addons/Redis'

const MS = 1000 * 2 * 60 // 2 min
let taskId

interface StatesResponse {
  time: number
}

async function getCurrentTime(): Promise<void> {
  try {
    const response = await axios.get<{ data: StatesResponse[]}>(`https://wakatime.com/api/v1/users/${Env.get('WAKATIME_USER')}/heartbeats`, {
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
          if (redis_state) await Redis.set('states:sleeping', 'false')
        }
      }
    }
  } catch (error) {
    Logger.error('Error while getting the states')
  }
}

export async function Activate(): Promise<void> {
  Logger.info(`Starting task runner for getting current developing state [every ${MS} ms]`)
  await getCurrentTime()
  taskId = setInterval(getCurrentTime, MS)
}

export function ShutDown(): void {
  clearInterval(taskId)
  Logger.info('Shutdown task runner for getting current developing state')
}
