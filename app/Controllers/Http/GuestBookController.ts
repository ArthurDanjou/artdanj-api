import {HttpContextContract} from "@ioc:Adonis/Core/HttpContext";
import GuestValidator from "App/Validators/guestbook/GuestValidator";
import GuestbookMessage from "App/Models/GuestbookMessage";
import User from "App/Models/User";

export default class GuestBookController {

  public async index ({ response }: HttpContextContract) {
    const guestbook_messages = await GuestbookMessage
      .query()
      .preload('user')
      .orderBy('created_at', 'desc')
    return response.status(200).send({
      guestbook_messages
    })
  }

  public async store ({ request, response }: HttpContextContract) {
    const data = await request.validate(GuestValidator)
    let user = await User.findBy('email', data.email)
    if (!user) {
      user = await User.create({
        email: data.email,
      })
    }
    const guestbook_message = user.related('guestbook_message').firstOrCreate({
      userId: user.id
    }, {
      userId: user.id,
      message: data.message
    })
    return response.status(200).send({
      guestbook_message
    })
  }

  public async show ({ params, response }: HttpContextContract) {
    return response.status(200).send({
      guestbook_message: await GuestbookMessage.findOrFail(params.id)
    })
  }

  public async destroy ({ params, response }: HttpContextContract) {
    const guestbook_message = await GuestbookMessage.findOrFail(params.id)
    await guestbook_message.delete()
    return response.status(200).send({
      message: 'GuestBookMessage successfully deleted!'
    })
  }

  public async exists ({ params, response }: HttpContextContract) {
    const email = await params.email
    const guestbook_message = await GuestbookMessage.findBy('email', email)
    return response.status(200).send({
      signed: guestbook_message !== null
    })
  }
}
