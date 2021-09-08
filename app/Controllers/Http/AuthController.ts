import {HttpContextContract} from '@ioc:Adonis/Core/HttpContext'
import User from "App/Models/User";

export default class AuthController {

  public async loginApi ({ request, auth, response }: HttpContextContract) {
    const email = request.input('email')
    const password = request.input('password')
    const infinity = request.input('infinity', false)

    const token = await auth.use('api').attempt(email, password, {
      expiresIn: infinity ? '' : '2 days'
    })
    return response.status(200).send({
      token: token.toJSON()
    })
  }

  public async loginWeb ({ request, auth, response }: HttpContextContract) {
    const email = request.input('email')
    const password = request.input('password')
    const remember = request.input('rembember', false)

    await auth.use('web').attempt(email, password, remember)

    return response.status(200).send({
      user: auth.use('web').user
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

  public async logoutApi ({ auth, response }: HttpContextContract) {
    await auth.use('api').logout()
    await auth.use('api').revoke()
    return response.status(200).send({
      message: 'You have been disconnected!'
    })
  }

  public async logoutWeb ({ auth, response }: HttpContextContract) {
    await auth.use('web').logout()
    await auth.use('api').revoke()
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
