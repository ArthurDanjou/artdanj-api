import {HttpContextContract} from '@ioc:Adonis/Core/HttpContext'
import User from "App/Models/User";
import AuthValidator from "App/Validators/AuthValidator";

export default class AuthController {

  public async loginWeb ({request, auth}: HttpContextContract) {
    const data = await request.validate(AuthValidator)
    const {email, password, remember_me } = data

    try {
      await auth.attempt(email, password, remember_me)
      const user = await User.query()
        .where('id', auth.user!.id)
        .firstOrFail()
      if (!remember_me) {
        await user.merge({
          rememberMeToken: ''
        }).save()
      }
      return { user }
    } catch (error) {
      if (error.code === 'E_INVALID_AUTH_UID') return { error: "L'utilisateur n'a pas été trouvé" }
      if (error.code === 'E_INVALID_AUTH_PASSWORD') return { error: "L'identifiant ou le mot de passe est incorrect" }
    }
  }

  public async loginApi ({request, auth}: HttpContextContract) {
    const email = request.input('email')
    const password = request.input('password')

    const token = await auth.use('api').attempt(email, password, {
      expiresIn: '2 days'
    })
    return token.toJSON()
  }

  public async createInfiniteToken ({request, auth}: HttpContextContract) {
    const email = request.input('email')
    const password = request.input('password')
    const token = await auth.use('api').attempt(email, password)
    return token.toJSON()
  }

  public async logoutWeb ({auth}: HttpContextContract) {
    await auth.logout()
    return { message: 'Vous avez été déconnecté' }
  }

  public async logoutApi ({auth}: HttpContextContract) {
    await auth.use('api').logout()
    return { message: 'Vous avez été déconnecté' }
  }

  public async user ({auth}: HttpContextContract) {
    await auth.authenticate()
    const user = await User.query()
      .where('id', auth.user!.id)
      .firstOrFail()
    return { user }
  }

}
