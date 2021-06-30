import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import {rules, schema} from '@ioc:Adonis/Core/Validator'

export default class AuthValidator {
  constructor (private ctx: HttpContextContract) {
  }

  public schema = schema.create({
    email: schema.string({ trim: true }, [
      rules.email(),
      rules.required()
    ]),
    password: schema.string({ trim: true }, [
      rules.required()
    ]),
    remember_me: schema.boolean()
  })

  public cacheKey = this.ctx.routeKey

  public messages = {
    'email.email': 'L\'adresse mail n\'est pas valide !',
    'email.required': 'Veuillez renseigner une adresse mail !',
    'password.required': 'Veuillez renseigner un mot de passe !',
  }
}
