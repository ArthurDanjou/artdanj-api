import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import {rules, schema} from '@ioc:Adonis/Core/Validator'

export default class StoreValidator {
  constructor (private ctx: HttpContextContract) {
  }

  public schema = schema.create({
    title: schema.string(),
    content: schema.string(),
    description: schema.string(),
    readingTime: schema.number(),
    coverId: schema.number([rules.exists({ table: 'files', column: 'id' })]),
    tags: schema.array().members(
      schema.number()
    ),
    lightBackGround: schema.boolean()
  })

  public cacheKey = this.ctx.routeKey

  public messages = {
    required: 'Le champ {{field}} doit être valide !',
  }
}
