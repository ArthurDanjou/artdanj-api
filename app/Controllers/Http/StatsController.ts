import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class StatsController {

  public async get ({response}: HttpContextContract) {
    return response.status(200).send({
      daily: this.getDailyStats(),
      weekly: this.getWeeklyStats(),
      monthly: this.getMontlyStats()
    })
  }

  getDailyStats() {
    return {
      development_hours: 0
    }
  }

  getWeeklyStats() {
    return {
      development_hours: 0
    }
  }

  getMontlyStats() {

    return {
      development_hours: 0
    }
  }

}
