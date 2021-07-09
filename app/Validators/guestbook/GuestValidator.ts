import {HttpContextContract} from '@ioc:Adonis/Core/HttpContext'
import {rules, schema} from '@ioc:Adonis/Core/Validator'

export default class GuestValidator {
  constructor (private ctx: HttpContextContract) {
  }

  public schema = schema.create({
    message: schema.string({}, [
      rules.required()
    ]),
    email: schema.string({}, [
      rules.email()
    ])
  })

  public cacheKey = this.ctx.routeKey

  public messages = {
    required: 'Le champ {{field}} doit être valide !',
  }
}
