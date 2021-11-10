import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { rules, schema } from '@ioc:Adonis/Core/Validator'

export default class UserStoreValidator {
  public schema = schema.create({
    email: schema.string({ trim: true, escape: true }, [
      rules.email(),
      rules.required(),
      rules.unique({
        table: 'users',
        column: 'email',
      }),
    ]),
  })

  public messages = {
    'required': 'The field {{field}} is required',
    'email.email': 'The email must be valid',
    'email.unique': 'The email is not unique',
  }

  constructor(protected ctx: HttpContextContract) {
  }
}
