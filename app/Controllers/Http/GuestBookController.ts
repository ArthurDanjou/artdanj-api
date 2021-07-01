import {HttpContextContract} from "@ioc:Adonis/Core/HttpContext";
import GuestBookMessage from "App/Models/GuestBookMessage";
import GuestValidator from "App/Validators/guestbook/GuestValidator";

export default class GuestBookController {

  public async get({response}: HttpContextContract) {
    return response.status(200).send({
      guestbook_messages: GuestBookMessage.query().orderBy('created_at', 'desc')
    })
  }

  public async store({request, auth, response}: HttpContextContract) {
    const data = await request.validate(GuestValidator)
    const user = await auth.user!
    const guestbook_message = user.related('guestbook_message').firstOrCreate({
      userId: user.id
    }, {
      ...data,
      userId: user.id
    })
    return response.status(200).send({
      guestbook_message
    })
  }

}
