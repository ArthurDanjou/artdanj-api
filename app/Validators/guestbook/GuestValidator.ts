import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import {rules, schema} from '@ioc:Adonis/Core/Validator'

export default class GuestValidator {
  constructor (private ctx: HttpContextContract) {
  }

  public schema = schema.create({
    user_id: schema.number( [
      rules.required(),
      rules.unique({table: 'golden_messages', column: 'user_id'}),
      rules.exists({ table: 'users', column: 'id'})
    ]),
    message: schema.string({}, [
      rules.required()
    ])
  })

  public cacheKey = this.ctx.routeKey

  public messages = {
    required: 'Le champ {{field}} doit être valide !',
  }
}
