import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import {getTotalStats, getWeeklyStats, getMonthlyStats, getOtherStats} from 'App/Helpers/StatsHelper'
import DockerBuild from "App/Models/DockerBuild";
import DockerCommand from "App/Models/DockerCommand";

export default class StatsController {

  public async get ({response}: HttpContextContract) {
    return response.status(200).send({
      weekly: getWeeklyStats(),
      monthly: getMonthlyStats(),
      total: getTotalStats(),
      other : getOtherStats()
    })
  }

  public async incrementBuild () {
    const date = new Date()
    const last_entry = await DockerBuild.findBy('created_at', date)

    if (last_entry) {
      last_entry.builds = last_entry.builds ++
      await last_entry.save()
    } else {
      await DockerBuild.create({
        builds: BigInt(1)
      })
    }
  }

  public async incrementCommand () {
    const date = new Date()
    const last_entry = await DockerCommand.findBy('created_at', date)

    if (last_entry) {
      last_entry.commands = last_entry.commands ++
      await last_entry.save()
    } else {
      await DockerCommand.create({
        commands: BigInt(1)
      })
    }
  }

}
