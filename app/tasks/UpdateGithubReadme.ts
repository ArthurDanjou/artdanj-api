import {getDailyStats, getMonthlyStats, getTotalStats, getWeeklyStats} from "App/Helpers/StatsHelper";
import Redis from "@ioc:Adonis/Addons/Redis";
import axios from 'axios'
import Env from "@ioc:Adonis/Core/Env";

export async function UpdateGitHubReadme(): Promise<void> {
  const daily_stats = await getDailyStats()
  const weekly_stats = await getWeeklyStats()
  const monthly = await getMonthlyStats()
  const total_stats = await getTotalStats()

  const sleeping = await Boolean(Redis.get('artapi/states/sleeping')) || false
  const learning = await Boolean(Redis.get('artapi/states/learning')) || false
  const developing = await Boolean(Redis.get('artapi/states/developing')) || false
  const listening_music = await Boolean(Redis.get('artapi/states/listening')) || false

  console.log(sleeping, learning, developing, listening_music)
  console.log(getStatus(sleeping), getStatus(learning), getStatus(developing), getStatus(listening_music))

  const stats_table = `| Statistics                                  |    Daily    |      Weekly |      Monthly |        Total |
| :------------------------------------------ | ----------: | ----------: | -----------: | -----------: |
| :computer: Commands                         |       **${daily_stats.docker_commands_run}** |       **${weekly_stats.docker_commands_run}** |        **${monthly.docker_commands_run}** |        **${total_stats.docker_commands_run}** |
| :hammer: Docker Builds                      |       **${daily_stats.docker_build_count}** |       **${weekly_stats.docker_build_count}** |        **${monthly.docker_build_count}** |        **${total_stats.docker_build_count}** |`

  const infos_table = `| Informations                 |   State |
| ---------------------------: | ------: |
| :musical_note: Music Playing |  **${getStatus(listening_music)}** |
|               :bed: Sleeping |  **${getStatus(sleeping)}** |
|        :computer: Developing |  **${getStatus(developing)}** |
|             :books: Learning |  **${getStatus(learning)}** |`

  let change = true;

  const {data: read_me} = await axios.get('https://api.github.com/repos/arthurdanjou/arthurdanjou/readme', {
    headers: {
      authorization: `Bearer ${Env.get('GITHUB_TOKEN')}`
    },
  })

  const content = Buffer.from(read_me.content, 'base64').toString()

  const stats_table_check = '| Statistics' + content.split('| Statistics')[1]
  if (!stats_table_check) change = true
  const old_stats_table = stats_table_check.split('| Informations')[0]
  if (!old_stats_table) change = true

  const infos_table_check = '| Informations' + content.split('| Informations')[1]
  if (!infos_table_check) change = true
  const old_infos_table = infos_table_check.split('###### Curious')[0]
  if (!old_infos_table) change = true

  if (old_infos_table == infos_table && old_stats_table == stats_table) change = false

  if (!change) return

  let new_content = content.replace(old_stats_table, stats_table + '\n\n');
  new_content = new_content.replace(old_infos_table, infos_table + '\n\n')

  await axios.put('https://api.github.com/repos/ArthurDanjou/ArthurDanjou/contents/README.md',
    {
      message: 'Updating recent statistics & informations',
      content: Buffer.from(new_content, 'utf8').toString('base64'),
      sha: read_me.sha,
      author: {
        name: 'api.arthurdanjou.fr - API Automation',
        email: 'me@arthurdanjou.fr'
      }
    }, {
      headers: {
        authorization: `Bearer ${Env.get('GITHUB_TOKEN')}`
      }
    }
  )
}

function getStatus(state: boolean): string {
  return state ? "Yes" : "No"
}
