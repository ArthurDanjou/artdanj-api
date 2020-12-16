import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import {schema} from '@ioc:Adonis/Core/Validator'

export default class UpdateValidator {
  constructor (private ctx: HttpContextContract) {
  }

  public schema = schema.create({
    place: schema.string.optional(),
    since: schema.date.optional(),
    left: schema.string.optional(),
  })

  public cacheKey = this.ctx.routeKey

  public messages = {
    required: 'Le champ {{field}} doit être valide !'
  }
}
