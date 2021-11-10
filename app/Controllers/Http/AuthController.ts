import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import AuthValidator from 'App/Validators/AuthValidator'

export default class AuthController {
  public async loginApi({ request, auth, response }: HttpContextContract) {
    const { email, password } = await request.validate(AuthValidator)
    const token = await auth.use('api').attempt(email, password, {
      expiresIn: '2 days',
    })
    return response.status(200).send({
      token: token.toJSON(),
    })
  }

  public async loginWeb({ request, auth, response }: HttpContextContract) {
    const { email, password, remember } = await request.validate(AuthValidator)
    await auth.use('web').attempt(email, password, remember)

    return response.status(200).send({
      user: auth.use('web').user,
    })
  }

  public async createInfiniteToken({ request, auth, response }: HttpContextContract) {
    const { email, password } = await request.validate(AuthValidator)
    const token = await auth.use('api').attempt(email, password)
    return response.status(200).send({
      token: token.toJSON(),
    })
  }

  public async logoutApi({ auth, response }: HttpContextContract) {
    await auth.use('api').revoke()
    return response.status(200).send({
      message: 'You have been disconnected!',
    })
  }

  public async logoutWeb({ auth, response }: HttpContextContract) {
    await auth.use('web').logout()
    return response.status(200).send({
      message: 'You have been disconnected!',
    })
  }

  public async user({ auth, response }: HttpContextContract) {
    const user = await auth.use('web').authenticate() || await auth.use('api').authenticate()
    return response.status(200).send({
      user,
    })
  }
}
