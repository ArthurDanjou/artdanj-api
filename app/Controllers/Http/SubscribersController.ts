import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Subscriber from 'App/Models/Subscriber'
import SubscriberStoreValidator from 'App/Validators/subscriber/SubscriberStoreValidator'

export default class SubscribersController {
  public async index({ response }: HttpContextContract) {
    const subscribers = await Subscriber.query()
    return response.status(200).send({
      count: subscribers.length,
      subscribers,
    })
  }

  public async store({ request, response }: HttpContextContract) {
    const data = await request.validate(SubscriberStoreValidator)
    return response.status(200).send({
      subscriber: await Subscriber.create(data),
    })
  }

  public async destroy({ params, response }: HttpContextContract) {
    const subscriber = await Subscriber.findOrFail(params.id)
    await subscriber.delete()
    return response.status(200).send({
      message: 'Subscriber successfully deleted!',
    })
  }
}
