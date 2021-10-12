import Logger from "@ioc:Adonis/Core/Logger";
import Env from "@ioc:Adonis/Core/Env";
import axios from "axios";
import DevelopmentHour from "App/Models/DevelopmentHour";

const MS = 1000 * 5 * 60 // 5 min
let taskId

interface StatsResponse {
  grand_total: {
    total_seconds: number
  }
  range: {
    date: string
  }
}

async function getDevelopmentHours(): Promise<void> {
  const response = await axios.get<{ data: StatsResponse[]}>(`https://wakatime.com/share/@${Env.get('WAKATIME_USER')}/${Env.get('WAKATIME_ID')}.json`)
  if (response.status === 200) {
    const mapped_stats = response.data.data.map((item: StatsResponse) => {
      return {
        seconds: item.grand_total.total_seconds, date: item.range.date
      }
    })

    for (const data of mapped_stats) {
      await DevelopmentHour.updateOrCreate({
        date: data.date.split('T')[0]
      }, {
        date: data.date.split('T')[0],
        seconds: data.seconds
      })
    }
  }
}

export async function Activate(): Promise<void> {
  Logger.info(`Starting task runner for getting development hours [every ${MS} ms]`)
  await getDevelopmentHours()
  taskId = setInterval(getDevelopmentHours, MS)
  return
}

export function ShutDown(): void {
  clearInterval(taskId)
  Logger.info(`Shutdown task runner for getting development hours`)
}
