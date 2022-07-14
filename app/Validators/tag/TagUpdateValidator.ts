import { schema } from '@ioc:Adonis/Core/Validator'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class TagUpdateValidator {
  constructor(protected ctx: HttpContextContract) {
  }

  public schema = schema.create({
    label: schema.string.optional(),
  })

  public messages = {
    required: 'The field {{field}} is required',
  }
}
