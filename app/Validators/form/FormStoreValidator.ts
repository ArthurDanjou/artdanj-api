import { schema } from '@ioc:Adonis/Core/Validator'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class FormStoreValidator {
  constructor(protected ctx: HttpContextContract) {
  }

  public schema = schema.create({
    name: schema.string(),
    email: schema.string(),
    subject: schema.string(),
    content: schema.string(),
  })

  public messages = {
    required: 'The field {{field}} is required',
  }
}
