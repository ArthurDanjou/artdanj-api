import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import {rules, schema} from '@ioc:Adonis/Core/Validator'

export default class UserStoreValidator {
  constructor (private ctx: HttpContextContract) {
  }

  public schema = schema.create({
    email: schema.string({ trim: true, escape: true }, [
      rules.email(),
      rules.required(),
      rules.unique({table: 'users', column: 'email'})
    ])
  })

  public cacheKey = this.ctx.routeKey

  public messages = {
    required: 'Le champ {{field}} doit être valide !',
    'email.email': 'L\'adresse mail doit être valide !',
  }
}
