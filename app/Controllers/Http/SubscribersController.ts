import {HttpContextContract} from '@ioc:Adonis/Core/HttpContext'
import Subscriber from "App/Models/Subscriber";
import SubscriberValidator from "App/Validators/subscriber/SubscriberValidator";

export default class SubscribersController {

  public async get ({ response }: HttpContextContract) {
    const subscribers = await Subscriber.query()
    return response.status(200).send({
      count: subscribers.length
    })
  }

  public async store({request, response}: HttpContextContract) {
    const data = await request.validate(SubscriberValidator)
    const email = await Subscriber.findBy('email', data.email)
    if (email) {
      return response.status(201).send({
        message: 'Subscriber already exists'
      })
    }
    await Subscriber.create(data)
    return response.status(200).send({
      message: 'Subscriber successfully registered!'
    })
  }

  public async delete({request, response}: HttpContextContract) {
    const data = await request.validate(SubscriberValidator)
    const subscriber = await Subscriber.findBy('email', data.email)
    if (subscriber) {
      await subscriber.delete()
      return response.status(200).send({
        message: 'Subscriber successfully deleted!'
      })
    }
  }

}
