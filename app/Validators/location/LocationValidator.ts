import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { schema } from '@ioc:Adonis/Core/Validator'

export default class LocationValidator {
  constructor(private ctx: HttpContextContract) {
  }

  public schema = schema.create({
    place: schema.string(),
    since: schema.date(),
    left: schema.string(),
  })

  public cacheKey = this.ctx.routeKey

  public messages = {
    required: 'The field {{field}} is required',
  }
}
