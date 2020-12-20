import {getDailyStats, getMonthlyStats, getTotalStats, getWeeklyStats} from "App/Helpers/StatsHelper";
import Redis from "@ioc:Adonis/Addons/Redis";
import axios from 'axios'
import Env from "@ioc:Adonis/Core/Env";

export async function UpdateGitHubReadme(): Promise<void> {
  const daily_stats = await getDailyStats()
  const weekly_stats = await getWeeklyStats()
  const monthly = await getMonthlyStats()
  const total_stats = await getTotalStats()

  const sleeping = Boolean(await Redis.get('artapi/state/sleeping')) || false
  const learning = Boolean(await Redis.get('artapi/state/learning')) || false
  const developing = Boolean(await Redis.get('artapi/state/developing')) || false
  const listening_music = Boolean(await Redis.get('artapi/state/listening')) || false

  const infos_table = `| Statistics                                  |    Daily    |      Weekly |      Monthly |        Total |
| :------------------------------------------ | ----------: | ----------: | -----------: | -----------: |
| :computer: Commands                         |       **${daily_stats.docker_commands_run}** |       **${weekly_stats.docker_commands_run}** |        **${monthly.docker_commands_run}** |        **${total_stats.docker_commands_run}** |
| :hammer: Docker Builds                      |       **${daily_stats.docker_build_count}** |       **${weekly_stats.docker_build_count}** |        **${monthly.docker_build_count}** |        **${total_stats.docker_build_count}** |`

  const stats_table = `| Informations                 |   State |
| ---------------------------: | ------: |
| :musical_note: Music Playing |  **${listening_music}** |
|               :bed: Sleeping |  **${sleeping}** |
|        :computer: Developing |  **${developing}** |
|             :books: Learning |  **${learning}** |`

  let change = true;

  const {data: read_me} = await axios.get('https://api.github.com/repos/arthurdanjou/arthurdanjou/readme', {
    headers: {
      authorization: `Bearer ${Env.get('GITHUB_TOKEN')}`
    },
  })

  const content = Buffer.from(read_me.content, 'base64').toString()

  const stats_table_check = '| Statistics' + content.split('| Statistics')[1]
  if (!stats_table_check) change = true
  const old_stats_table = stats_table_check.split('\n\n| Informations')[0]
  if (!old_stats_table) change = true

  const infos_table_check = '| Informations' + content.split('| Informations')[1]
  if (!infos_table_check) change = true
  const old_infos_table = infos_table_check.split('\n\n###### ')[0]
  if (!old_infos_table) change = true

  if (old_infos_table == infos_table && old_stats_table == stats_table) change = false

  // Ignore the change if the contents is the same
  if (!change) return

  let new_content = content.replace(old_stats_table, stats_table);
  new_content = new_content.replace(old_infos_table, infos_table)

  await axios.post('https://api.github.com/repos/arthurdanjou/arthurdanjou/contents/README.md', {
    headers: {
      authorization: `Bearer ${Env.get('GITHUB_TOKEN')}`
    },
    json: {
      message: 'Updating recent statistics & informations',
      content: Buffer.from(new_content, 'utf8').toString('base64'),
      sha: read_me.sha,
      author: {
        name: 'api.arthurdanjou.fr - API Automation',
        email: 'me@arthurdanjou.fr'
      }
    }
  })
}
