import axios from 'axios'
import Env from '@ioc:Adonis/Core/Env'
import Logger from '@ioc:Adonis/Core/Logger'
import {
  fetchDailyStatistics,
  fetchMonthlyStatistics,
  fetchStatistics,
  fetchWeeklyStatistics,
} from 'App/Utils/StatsUtils'
import { Stats } from 'App/Types/IStats'

export async function UpdateGithubReadme(): Promise<void> {
  const daily_stats = await fetchDailyStatistics()
  const weekly_stats = await fetchWeeklyStatistics()
  const monthly_stats = await fetchMonthlyStatistics()
  const total_stats = await fetchStatistics()

  const response = await axios.get<{ content: string; sha: string }>(`https://api.github.com/repos/${Env.get('GITHUB_USERNAME')}/${Env.get('GITHUB_USERNAME')}/readme`, {
    headers: {
      authorization: `Bearer ${Env.get('GITHUB_TOKEN')}`,
    },
  })

  if (response.status === 200) {
    const content = Buffer.from(response.data.content, 'base64').toString()
    const old_table = content.split('<!-- Start Table -->')[1].split('<!-- End Table -->')[0]
    const new_table = `
| Title                                       |       Daily |      Weekly |      Monthly |        Total |
| :------------------------------------------ | ----------: | ----------: | -----------: | -----------: |
| :hourglass_flowing_sand: Hours Spent Coding |  **${getTotalHours(daily_stats)}**  | **${getTotalHours(weekly_stats)}**   | **${getTotalHours(monthly_stats)}**    | **${getTotalHours(total_stats)}**   |
| :computer: Terminal Commands                |  **${daily_stats.commands_ran}**  | **${weekly_stats.commands_ran}**   | **${monthly_stats.commands_ran}**    | **${total_stats.commands_ran}**    |
| :hammer: Docker Builds                      |  **${daily_stats.builds_ran}**  | **${weekly_stats.builds_ran}**   | **${monthly_stats.builds_ran}**    | **${total_stats.builds_ran}**    |\n`
    const new_content = content.replace(old_table, new_table)

    const update = await axios.put(`https://api.github.com/repos/${Env.get('GITHUB_USERNAME')}/${Env.get('GITHUB_USERNAME')}/contents/README.md`,
      {
        message: '📊 Updated Statistics - Athena',
        content: Buffer.from(new_content, 'utf8').toString('base64'),
        sha: response.data.sha,
        author: {
          name: 'Athena - API Automation',
          email: 'api@arthurdanjou.fr',
        },
      },
      {
        headers: {
          authorization: `Bearer ${Env.get('GITHUB_TOKEN')}`,
        },
      })
    if (update.status !== 200)
      Logger.error('Error while updating statistics')
  }
}

function getTotalHours(stats: Stats): string {
  return `${(stats.development_time.hours + stats.development_time.minutes / 60 + stats.development_time.seconds / 3600).toFixed(2)}hrs`
}
