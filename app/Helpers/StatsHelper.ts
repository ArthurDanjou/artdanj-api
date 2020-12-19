import DockerCommand from "App/Models/DockerCommand";
import DockerBuild from "App/Models/DockerBuild";

async function getDailyStats() {
  const commands = await DockerCommand.query().where('created_at', '>', new Date().getTime())
  const builds = await DockerBuild.query().where('created_at', '>', new Date().getTime())

  return {
    docker_commands_run: commands.length,
    docker_build_count: builds.length,
  }
}

async function getWeeklyStats() {
  const commands = await DockerCommand.query().where('created_at', '>', new Date().getTime() - 1000 * 60 * 60 * 24 * 7)
  const builds = await DockerBuild.query().where('created_at', '>', new Date().getTime() - 1000 * 60 * 60 * 24 * 7)

  return {
    docker_commands_run: commands.length,
    docker_build_count: builds.length,
  }
}

async function getMonthlyStats() {
  const commands = await DockerCommand.query().where('created_at', '>', new Date().getMonth() - 1)
  const builds = await DockerBuild.query().where('created_at', '>', new Date().getMonth() - 1)

  return {
    docker_commands_run: commands.length,
    docker_build_count: builds.length,
  }
}

async function getTotalStats() {
  const commands = await DockerCommand.query()
  const builds = await DockerBuild.query()

  return {
    docker_commands_run: commands.length,
    docker_build_count: builds.length
  }
}


export {getMonthlyStats, getTotalStats, getWeeklyStats, getDailyStats}
