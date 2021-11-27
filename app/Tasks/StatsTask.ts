import Logger from '@ioc:Adonis/Core/Logger'
import Env from '@ioc:Adonis/Core/Env'
import axios from 'axios'
import DevelopmentHour from 'App/Models/DevelopmentHour'
import { UpdateGithubReadme } from 'App/Utils/UpdateGithubReadme'

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
  try {
    const response = await axios.get<{ data: StatsResponse[]}>(`https://wakatime.com/share/@${Env.get('WAKATIME_USER')}/${Env.get('WAKATIME_ID')}.json`)
    if (response.status === 200) {
      const mapped_stats = response.data.data.map((item: StatsResponse) => {
        return {
          seconds: item.grand_total.total_seconds, date: item.range.date,
        }
      })

      for (const data of mapped_stats) {
        await DevelopmentHour.updateOrCreate({
          date: data.date.split('T')[0],
        }, {
          date: data.date.split('T')[0],
          seconds: data.seconds,
        })
      }

      await UpdateGithubReadme()
    }
  }
  catch (error) {
    Logger.error('Error while getting the stats')
  }
}

export async function Activate(): Promise<void> {
  Logger.info(`Starting task runner for getting development hours [every ${MS} ms]`)
  await getDevelopmentHours()
  taskId = setInterval(getDevelopmentHours, MS)
}

export function ShutDown(): void {
  clearInterval(taskId)
  Logger.info('Shutdown task runner for getting development hours')
}
