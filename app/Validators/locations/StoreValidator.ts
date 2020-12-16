import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import {schema} from '@ioc:Adonis/Core/Validator'

export default class StoreValidator {
  constructor (private ctx: HttpContextContract) {
  }

  public schema = schema.create({
    place: schema.string(),
    since: schema.date(),
    left: schema.string(),
  })

  public cacheKey = this.ctx.routeKey

  public messages = {
    required: 'Le champ {{field}} doit être valide !',
  }
}
