import {HttpContextContract} from "@ioc:Adonis/Core/HttpContext";
import GuestBookMessage from "../../Models/GuestBookMessage";
import GuestValidator from "../../Validators/guestbook/GuestValidator";

export default class GuestBookController {

  public async get () {
    return GuestBookMessage.query().orderBy('created_at', 'desc')
  }

  public async store ({request, auth}: HttpContextContract) {
    if (auth.isLoggedIn) {
      const data = await request.validate(GuestValidator)
      return await GuestBookMessage.create(data)
    }
  }

}
