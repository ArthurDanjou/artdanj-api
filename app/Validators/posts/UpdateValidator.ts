import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import {rules, schema} from '@ioc:Adonis/Core/Validator'

export default class UpdateValidator {
  constructor (private ctx: HttpContextContract) {
  }

  public schema = schema.create({
    title: schema.string.optional(),
    content: schema.string.optional(),
    description: schema.string.optional(),
    readingTime: schema.number.optional(),
    coverId: schema.number.optional([rules.exists({ table: 'files', column: 'id' })]),
    tags: schema.array.optional().members(
      schema.number()
    ),
    lightBackGround: schema.boolean.optional()
  })

  public cacheKey = this.ctx.routeKey

  public messages = {
    required: 'Le champ {{field}} doit être valide !'
  }
}
