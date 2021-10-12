import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import CommandsRun from "App/Models/CommandsRun";
import BuildsRun from "App/Models/BuildsRun";
import {
  fetchDailyStatistics,
  fetchMonthlyStatistics,
  fetchStatistics,
  fetchWeeklyStatistics,
  NOW
} from "App/Utils/StatsUtils";

export default class StatsController {

  public async index ({ response }: HttpContextContract) {
    const daily = await fetchDailyStatistics()
    const weekly = await fetchWeeklyStatistics()
    const monthly = await fetchMonthlyStatistics()
    const total = await fetchStatistics()

    return response.status(200).send({
      daily,
      weekly,
      monthly,
      total: {
        development_time: total.development_time,
        commands_run: total.commands_ran,
        builds_run: total.builds_ran,
      }
    })
  }

  public async incrementCommandCount({ response }: HttpContextContract) {
    const current_commands = await CommandsRun.firstOrCreate(
      {
        date: NOW
      },
      {
        date: NOW,
        commands: 0
      }
    )

    current_commands.commands++
    await current_commands.save()

    return response.status(200).send({
      message: 'Commands Count successfully incremented!'
    })
  }

  public async incrementBuildCount({ response }: HttpContextContract) {
    const current_builds = await BuildsRun.firstOrCreate(
      {
        date: NOW
      },
      {
        date: NOW,
        builds: 0
      }
    )

    current_builds.builds++
    await current_builds.save()

    return response.status(200).send({
      message: 'Builds Count successfully incremented!'
    })
  }

}
