import { schema } from '@ioc:Adonis/Core/Validator'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class AnnounceStoreValidator {
  constructor (protected ctx: HttpContextContract) {
  }

  public schema = schema.create({
    code: schema.string(),
    cover: schema.string.optional(),
    color: schema.string(),
    hoverColor: schema.string()
  })
  public messages = {
    required: 'The field {{field}} is required'
  }
}
