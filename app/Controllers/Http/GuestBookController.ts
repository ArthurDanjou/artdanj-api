import {HttpContextContract} from "@ioc:Adonis/Core/HttpContext";
import GuestValidator from "App/Validators/guestbook/GuestValidator";
import GuestbookMessage from "App/Models/GuestbookMessage";

export default class GuestBookController {

  public async get({response}: HttpContextContract) {
    const guestbook_messages = await GuestbookMessage.query().orderBy('created_at', 'desc')
    return response.status(200).send({
      guestbook_messages
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
