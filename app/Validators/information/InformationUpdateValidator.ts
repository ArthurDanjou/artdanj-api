import { schema } from '@ioc:Adonis/Core/Validator'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class InformationUpdateValidator {
  public schema = schema.create({
    age: schema.number.optional(),
    code: schema.string.optional(),
  })

  public messages = {
    required: 'The field {{field}} is required',
  }

  constructor(protected ctx: HttpContextContract) {
  }
}
