import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import SubscriberValidator from "../../Validators/subscriber/SubscriberValidator";
import Subscriber from "../../Models/Subscriber";

export default class SubscribersController {

  public async get ({ response }: HttpContextContract) {
    return response.status(200).send({
      count: Subscriber.query().count
    })
  }

  public async store ({ request, response }: HttpContextContract) {
    const data = await request.validate(SubscriberValidator)
    await Subscriber.create(data)
    return response.status(200).send({
      message: 'Subscriber successfully registered !'
    })
  }

}
