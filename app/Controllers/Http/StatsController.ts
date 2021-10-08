import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import {
  fetchDailyStatistics,
  fetchMonthlyStatistics,
  fetchStatistics,
  fetchWeeklyStatistics
} from "App/Tasks/DevelopmentHoursTask";
import CommandsRun from "App/Models/CommandsRun";
import {DateTime} from "luxon";
import BuildsRun from "App/Models/BuildsRun";

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
      total
    })
  }

  public async incrementCommandCount({ response }: HttpContextContract) {
    const current_date = DateTime.fromJSDate(new Date(new Date().setUTCMinutes(0, 0, 0)))
    const current_commands = await CommandsRun.firstOrCreate(
      {
        date: current_date
      },
      {
        date: current_date,
        commands: 0
      }
    )

    current_commands.commands++
    await current_commands.save()

    return response.status(200).send({
      message: 'Commands Count successfully incremented !'
    })
  }

  public async incrementBuildCount({ response }: HttpContextContract) {
    const current_date = DateTime.fromJSDate(new Date(new Date().setUTCMinutes(0, 0, 0)))
    const current_builds = await BuildsRun.firstOrCreate(
      {
        date: current_date
      },
      {
        date: current_date,
        builds: 0
      }
    )

    current_builds.builds++
    await current_builds.save()

    return response.status(200).send({
      message: 'Builds Count successfully incremented !'
    })
  }

}
