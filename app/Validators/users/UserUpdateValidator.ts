import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import {rules, schema} from '@ioc:Adonis/Core/Validator'

export default class UserUpdateValidator {
  constructor (private ctx: HttpContextContract) {
  }

  public schema = schema.create({
    email: schema.string.optional({ trim: true, escape: true }, [rules.email()]),
    password: schema.string.optional({ trim: true, escape: true }, [rules.confirmed()]),
    is_confirmed: schema.boolean.optional(),
    confirmation_token: schema.string.optional({ trim: true, escape: true }),
    remember_me: schema.string.optional({ trim: true, escape: true }),
  })

  public cacheKey = this.ctx.routeKey

  public messages = {
    required: 'Le champ {{field}} doit être valide !',
    'email.email': 'L\'adresse mail doit être valide !',
    'password.confirmation': 'Les mots de passe ne correspondent pas !'
  }
}
