import {HttpContextContract} from '@ioc:Adonis/Core/HttpContext'
import User from "App/Models/User";
import AuthValidator from "App/Validators/AuthValidator";
import {AllyUserContract} from "@ioc:Adonis/Addons/Ally";

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
    return await User.query()
      .where('id', auth.user!.id)
      .firstOrFail()
  }

  public async twitter ({ally, auth}: HttpContextContract) {
    const twitter = ally.use('twitter')

    if (twitter.accessDenied()) {
      return 'Access Denied'
    }

    if (twitter.stateMisMatch()) {
      return 'Request expired. Retry again'
    }

    if (twitter.hasError()) {
      return twitter.getError()
    }

    const twitterUser = await twitter.user()
    const user = await this.createUser(twitterUser)
    await auth.use('web').login(user)
    return user
  }

  public async github ({ally, auth}: HttpContextContract) {
    const github = ally.use('github')

    if (github.accessDenied()) {
      return 'Access Denied'
    }

    if (github.stateMisMatch()) {
      return 'Request expired. Retry again'
    }

    if (github.hasError()) {
      return github.getError()
    }

    const githubUser = await github.user()
    const user = await this.createUser(githubUser)
    await auth.use('web').login(user)
    return user
  }

  public async google ({ally, auth}: HttpContextContract) {
    const google = ally.use('google')

    if (google.accessDenied()) {
      return 'Access Denied'
    }

    if (google.stateMisMatch()) {
      return 'Request expired. Retry again'
    }

    if (google.hasError()) {
      return google.getError()
    }

    const googleUser = await google.user()
    const user = await this.createUser(googleUser)
    await auth.use('web').login(user)
    return user
  }

  public async createUser(allyUser: AllyUserContract<any>): Promise<User> {
    return await User.firstOrCreate({
      email: allyUser.email!,
    }, {
      email: allyUser.email!,
      username: allyUser.name,
      isConfirmed: allyUser.emailVerificationState === 'verified'
    })
  }

}
