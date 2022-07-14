import { schema } from '@ioc:Adonis/Core/Validator'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class StateSleepingValidator {
  constructor(protected ctx: HttpContextContract) {
  }

  public schema = schema.create({
    value: schema.boolean(),
  })

  public messages = {
    required: 'The field {{field}} is required',
  }
}
