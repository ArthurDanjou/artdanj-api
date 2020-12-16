import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import {rules, schema} from '@ioc:Adonis/Core/Validator'

export default class UpdateValidator {
  constructor (private ctx: HttpContextContract) {
  }

  public schema = schema.create({
    email: schema.string({ trim: true }, [
      rules.email(),
      rules.unique({table: 'subscribers', column: 'email'})
    ]),
    name: schema.string.optional()
  })

  public cacheKey = this.ctx.routeKey

  public messages = {
    required: 'Le champ {{field}} doit être valide !'
  }
}
