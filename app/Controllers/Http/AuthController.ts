import {HttpContextContract} from '@ioc:Adonis/Core/HttpContext'
import User from "App/Models/User";
import {AllyUserContract} from "@ioc:Adonis/Addons/Ally";

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

  public async twitter ({ ally, auth, response }: HttpContextContract) {
    const twitter = ally.use('twitter')

    if (twitter.accessDenied()) {
      return response.status(403).send({
        message: 'Access Denied!'
      })
    }

    if (twitter.stateMisMatch()) {
      return response.status(405).send({
        message: 'Request expired. Retry again!'
      })
    }

    if (twitter.hasError()) {
      return response.status(500).send({
        message: twitter.getError()
      })
    }

    const twitterUser = await twitter.user()
    const user = await this.createUser(twitterUser)
    await auth.use('web').login(user, true)
    return response.status(200).send({
      user: user
    })
  }

  public async discord ({ ally, auth, response }: HttpContextContract) {
    const discord = ally.use('discord')

    if (discord.accessDenied()) {
      return response.status(403).send({
        message: 'Access Denied!'
      })
    }

    if (discord.stateMisMatch()) {
      return response.status(405).send({
        message: 'Request expired. Retry again!'
      })
    }

    if (discord.hasError()) {
      return response.status(500).send({
        message: discord.getError()
      })
    }

    const discordUser = await discord.user()
    const user = await this.createUser(discordUser)
    await auth.use('web').login(user, true)
    return response.status(200).send({
      user: user
    })
  }

  public async github ({ request, ally, auth, response }: HttpContextContract) {
    const github = ally.use('github')
    const redirected_url = request.input('redirect')

    if (github.accessDenied()) {
      return response.status(403).send({
        message: 'Access Denied!'
      })
    }

    if (github.stateMisMatch()) {
      return response.status(405).send({
        message: 'Request expired. Retry again!'
      })
    }

    if (github.hasError()) {
      return response.status(500).send({
        message: github.getError()
      })
    }

    const githubUser = await github.user()
    const user = await this.createUser(githubUser)
    await auth.use('web').login(user, true)
    if (redirected_url) {
      return response.status(200).redirect(redirected_url)
    } else {
      return response.status(200).send({
        user: user
      })
    }
  }

  public async google ({ ally, auth, response, }: HttpContextContract) {
    const google = ally.use('google')

    if (google.accessDenied()) {
      return response.status(403).send({
        message: 'Access Denied!'
      })
    }

    if (google.stateMisMatch()) {
      return response.status(405).send({
        message: 'Request expired. Retry again!'
      })
    }

    if (google.hasError()) {
      return response.status(500).send({
        message: google.getError()
      })
    }

    const googleUser = await google.user()
    const user = await this.createUser(googleUser)
    await auth.use('web').login(user, true)
    return response.status(200).send({
      user: user
    })
  }

  public async createUser (allyUser: AllyUserContract<any>): Promise<User> {
    return await User.firstOrCreate({
      email: allyUser.email!,
    }, {
      email: allyUser.email!,
      username: allyUser.name,
      isConfirmed: allyUser.emailVerificationState === 'verified'
    })
  }

}
