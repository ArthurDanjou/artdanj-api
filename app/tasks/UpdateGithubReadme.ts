import Redis from "@ioc:Adonis/Addons/Redis";
import axios from 'axios'
import Env from "@ioc:Adonis/Core/Env";

export async function UpdateGitHubReadme(): Promise<void> {
  const sleeping = await Redis.get('artapi/states/sleeping')
  const learning = await Redis.get('artapi/states/learning')
  const developing = await Redis.get('artapi/states/developing')
  const listening_music = await Redis.get('artapi/states/listening')

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

  const infos_table_check = '| Informations' + content.split('| Informations')[1]
  if (!infos_table_check) change = true
  const old_infos_table = infos_table_check.split('###### Curious')[0]
  if (!old_infos_table) change = true

  if (!change) return

  await axios.put('https://api.github.com/repos/ArthurDanjou/ArthurDanjou/contents/README.md',
    {
      message: 'Updating recent statistics & informations',
      content: Buffer.from(content.replace(old_infos_table, infos_table + '\n\n'), 'utf8').toString('base64'),
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

function getStatus(state): string {
  return state === "true" ? "Yes" : "No"
}
