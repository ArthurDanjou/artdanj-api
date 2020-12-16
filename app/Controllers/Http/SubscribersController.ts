import {HttpContextContract} from "@ioc:Adonis/Core/HttpContext";
import Subscriber from "App/Models/Subscriber";
import StoreValidator from "App/Validators/subscriber/StoreValidator";
import UpdateValidator from "App/Validators/subscriber/UpdateValidator";

export default class SubscribersController {

  public async index ({request}: HttpContextContract) {
    const limit = request.input('limit')
    const page = request.input('page')
    if (limit && page) {
      return Subscriber.query().orderBy('id', 'asc').paginate(page, limit);
    } else {
      return Subscriber.query().orderBy('id', 'asc');
    }
  }

  public async store ({request}: HttpContextContract) {
    const data = await request.validate(StoreValidator)
    return await Subscriber.create(data)
  }

  public async show ({params}: HttpContextContract) {
    return await Subscriber.findOrFail(params.id)
  }

  public async update({ request, params }: HttpContextContract) {
    const subscriber = await Subscriber.findOrFail(params.id)
    const data = await request.validate(UpdateValidator)
    await subscriber.merge(data).save()

    return { message: 'L\'abonné a été mis à jour' }
  }

  public async destroy({ params }: HttpContextContract) {
    const subscriber = await Subscriber.findOrFail(params.id)
    await subscriber.delete()
    return { message: "L\'abonné a bien été supprimé" }
  }

}
