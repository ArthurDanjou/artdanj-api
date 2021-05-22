import {HttpContextContract} from "@ioc:Adonis/Core/HttpContext";
import GuestBookMessage from "../../Models/GuestBookMessage";
import StoreValidator from "../../Validators/guestbook/StoreValidator";

export default class GuestBookController {

  public async index () {
    return GuestBookMessage.query().orderBy('created_at', 'desc')
  }

  public async store ({request}: HttpContextContract) {
    const data = await request.validate(StoreValidator)
    return await GuestBookMessage.create(data)
  }

}
