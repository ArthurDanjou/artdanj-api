import { schema } from '@ioc:Adonis/Core/Validator'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class AnnounceUpdateValidator {
  constructor (protected ctx: HttpContextContract) {
  }

  public schema = schema.create({
    code: schema.string.optional(),
    cover: schema.string.optional(),
    color: schema.string.optional(),
    hoverColor: schema.string.optional()
  })

  public messages = {
    required: 'The field {{field}} is required'
  }
}
