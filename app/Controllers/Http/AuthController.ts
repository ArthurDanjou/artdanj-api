import {HttpContextContract} from '@ioc:Adonis/Core/HttpContext'
import User from "App/Models/User";

export default class AuthController {

  public async login ({ request, auth, response }: HttpContextContract) {
    const email = request.input('email')
    const password = request.input('password')
    const infinity = request.input('infinity', false)

    const token = await auth.attempt(email, password, {
      expiresIn: infinity ? '' : '2 days'
    })
    return response.status(200).send({
      token: token.toJSON()
    })
  }

  public async createInfiniteToken ({ request, auth, response }: HttpContextContract) {
    const email = request.input('email')
    const password = request.input('password')
    const token = await auth.attempt(email, password)
    return response.status(200).send({
      token: token.toJSON()
    })
  }

  public async logout ({ auth, response }: HttpContextContract) {
    await auth.logout()
    return response.status(200).send({
      message: 'You have been disconnected!'
    })
  }

  public async user ({ auth, response }: HttpContextContract) {
    await auth.authenticate()
    const user = await User.query()
      .where('id', auth.user!.id)
      .firstOrFail()
    return response.status(200).send({
      user: user
    })
  }

}
