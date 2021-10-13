import axios from "axios";
import Env from "@ioc:Adonis/Core/Env";
import Logger from "@ioc:Adonis/Core/Logger";
import Redis from "@ioc:Adonis/Addons/Redis";
import {btoa} from "buffer";

const MS = 1000 * 2 * 60 // 2 min
let taskId

interface StatesResponse {
  time: number
}

async function getCurrentTime(): Promise<void> {
  const response = await axios.get<{ data: StatesResponse[]}>(`https://wakatime.com/api/v1/users/${Env.get('WAKATIME_USER')}/heartbeats`, {
    headers: {
      'Authorization': `Basic ${btoa(Env.get('WAKATIME_KEY'))}`
    },
    params: {
      'date': new Date()
    }
  })

  if (response.status === 200) {
    const heartbeat = response.data.data[response.data.data.length -1]
    const current_time = new Date(Date.now()).getTime()/1000

    const active = current_time - heartbeat.time <= 60 * 10
    const redis_state = await Redis.get('states:developing') === 'true'

    if (redis_state !== active) {
      await Redis.set('states:developing', String(active))
    }
  }
}

export async function Activate(): Promise<void> {
  Logger.info(`Starting task runner for getting current developing state [every ${MS} ms]`)
  await getCurrentTime()
  taskId = setInterval(getCurrentTime, MS)
  return
}

export function ShutDown(): void {
  clearInterval(taskId)
  Logger.info(`Shutdown task runner for getting current developing state`)
}
