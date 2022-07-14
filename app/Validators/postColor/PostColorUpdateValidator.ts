import { schema } from '@ioc:Adonis/Core/Validator'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class PostColorUpdateValidator {
  public schema = schema.create({
    name: schema.string.optional(),
  })

  public messages = {
    required: 'The field {{field}} is required',
  }

  constructor(protected ctx: HttpContextContract) {
  }
}
