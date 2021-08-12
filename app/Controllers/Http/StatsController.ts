import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class StatsController {

  public async index ({ response }: HttpContextContract) {
    return response.status(200).send({
      message: 'Stats is under maintenance! Come back later.'
    })
  }

}
