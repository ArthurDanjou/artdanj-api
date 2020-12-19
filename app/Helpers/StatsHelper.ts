import DockerCommand from "App/Models/DockerCommand";
import axios from "axios";
import DockerBuild from "App/Models/DockerBuild";

async function getWeeklyStats() {
  const commands = await DockerCommand.query().where('created_at', '>', new Date().getTime() - 1000 * 60 * 60 * 24 * 7)
  const {data} = await axios.get('https://wakatime.com/api/v1/users/arthurdanjou/stats/last_7_days')
  const builds = await DockerBuild.query().where('created_at', '>', new Date().getMonth() - 1)

  return {
    development_hours: data.data.total_seconds / 60 / 60,
    docker_commands_run: commands.length,
    docker_build_count: builds.length,
    best_project: data.data.projects[0]
  }
}

async function getMonthlyStats() {
  const commands = await DockerCommand.query().where('created_at', '>', new Date().getMonth() - 1)
  const {data} = await axios.get('https://wakatime.com/api/v1/users/arthurdanjou/stats/last_30_days')
  const builds = await DockerBuild.query().where('created_at', '>', new Date().getMonth() - 1)

  return {
    development_hours: data.data.total_seconds / 60 / 60,
    docker_commands_run: commands.length,
    docker_build_count: builds.length,
    best_project: data.data.projects[0]
  }
}

async function getTotalStats() {
  const commands = await DockerCommand.query()
  const {data} = await axios.get('https://wakatime.com/api/v1/users/arthurdanjou/all_time_since_today')
  const builds = await DockerBuild.query()

  return {
    development_hours: data.data.seconds,
    docker_commands_run: commands.length,
    docker_build_count: builds.length
  }
}

async function getOtherStats() {
  const {data} = await axios.get('https://wakatime.com/api/v1/users/arthurdanjou/stats/last_year')

  return {
    daily_average: data.data.daily_average / 60 / 60,
    editors: [
      'WebStorm',
      'Intellij Idea',
      'PyCharm',
      'GoLang',
      'DataGrip'
    ],
    operating_systems: 'Windows'
  }
}

export {getMonthlyStats, getTotalStats, getWeeklyStats, getOtherStats}
