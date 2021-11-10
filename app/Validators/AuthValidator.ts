import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { rules, schema } from '@ioc:Adonis/Core/Validator'

export default class AuthValidator {
  public messages = {
    required: 'The field {{field}} is required',
  }

  public schema = schema.create({
    email: schema.string({ trim: true }, [
      rules.email(),
      rules.required(),
    ]),
    password: schema.string({ trim: true }, [
      rules.required(),
    ]),
    remember: schema.boolean.optional(),
  })

  constructor(protected ctx: HttpContextContract) {
  }
}
