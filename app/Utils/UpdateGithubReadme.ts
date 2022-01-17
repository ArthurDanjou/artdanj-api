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
import { getCurrentPlayingFromCache } from 'App/Utils/SongUtils'
import { GithubReason, GithubRequest } from 'App/Types/IGithub'

export async function updateGithubReadmeStats(): Promise<void> {
  const daily_stats = await fetchDailyStatistics()
  const weekly_stats = await fetchWeeklyStatistics()
  const monthly_stats = await fetchMonthlyStatistics()
  const total_stats = await fetchStatistics()

  const readme = await getReadmeContent()

  if (readme === null)
    return

  const old_table = readme.content.split('<!-- Start Table -->')[1].split('<!-- End Table -->')[0]
  const new_table = `
| Title                                       |       Daily |      Weekly |      Monthly |        Total |
| :------------------------------------------ | ----------: | ----------: | -----------: | -----------: |
| :hourglass_flowing_sand: Hours Spent Coding |  **${getTotalHours(daily_stats)}**  | **${getTotalHours(weekly_stats)}**   | **${getTotalHours(monthly_stats)}**    | **${getTotalHours(total_stats)}**   |
| :computer: Terminal Commands                |  **${daily_stats.commands_ran}**  | **${weekly_stats.commands_ran}**   | **${monthly_stats.commands_ran}**    | **${total_stats.commands_ran}**    |
| :hammer: Docker Builds                      |  **${daily_stats.builds_ran}**  | **${weekly_stats.builds_ran}**   | **${monthly_stats.builds_ran}**    | **${total_stats.builds_ran}**    |\n`

  await updateReadmeContent(
    {
      content: readme.content.replace(old_table, new_table),
      sha: readme.sha,
    },
    {
      reason: '📊 Updated Statistics - Athena',
      error: 'Error while updating statistics',
    })
}

export async function updateGithubReadmeSpotify(): Promise<void> {
  const current_song = await getCurrentPlayingFromCache()

  const readme = await getReadmeContent()

  if (readme === null)
    return

  let old_song
  let new_song

  if (current_song.is_playing) {
    old_song = readme.content.split('<!-- Start Song -->')[1].split('<!-- End Song -->')[0]
    new_song = `
<img alt="Spotify Cover Image" width="75em" height="75em" src="${current_song.image!.url}" />\n
**${current_song.name}** by *${current_song.author}*  <br/>
Listening from **${current_song.device_name}**\n`
  }
  else {
    old_song = readme.content.split('<!-- Start Song -->')[1].split('<!-- End Song -->')[0]
    new_song = '\nCurrently not listening to anything with Spotify\n'
  }

  if (readme.content.replace(old_song, new_song) !== readme.content) {
    await updateReadmeContent(
      {
        content: readme.content.replace(old_song, new_song),
        sha: readme.sha,
      },
      {
        reason: '🎵 Updated Song - Athena',
        error: 'Error while updating song',
      })
  }
}

async function getReadmeContent(): Promise<GithubRequest | null> {
  const response = await axios.get<GithubRequest>(`https://api.github.com/repos/${Env.get('GITHUB_USERNAME')}/${Env.get('GITHUB_USERNAME')}/readme`, {
    headers: {
      authorization: `Bearer ${Env.get('GITHUB_TOKEN')}`,
    },
  })
  return response.status === 200
    ? {
      content: Buffer.from(response.data.content, 'base64').toString(),
      sha: response.data.sha,
    }
    : null
}

async function updateReadmeContent(new_readme: GithubRequest, reason: GithubReason): Promise<void> {
  try {
    await axios.put(`https://api.github.com/repos/${Env.get('GITHUB_USERNAME')}/${Env.get('GITHUB_USERNAME')}/contents/README.md`,
      {
        message: reason.reason,
        content: Buffer.from(new_readme.content, 'utf8').toString('base64'),
        sha: new_readme.sha,
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
  }
  catch (error) {
    Logger.error(reason.error)
  }
}

function getTotalHours(stats: Stats): string {
  return `${(stats.development_time.hours + stats.development_time.minutes / 60 + stats.development_time.seconds / 3600).toFixed(2)}hrs`
}
