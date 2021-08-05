import {HttpContextContract} from '@ioc:Adonis/Core/HttpContext'
import {rules, schema} from '@ioc:Adonis/Core/Validator'

export default class UserUpdateValidator {
  public schema = schema.create({
    email: schema.string.optional({ trim: true, escape: true },
      [
        rules.email(),
        rules.unique(
          {
            table: 'users',
            column: 'email'
          })
      ]
    ),
    password: schema.string.optional({ trim: true, escape: true },
      [
        rules.confirmed()
      ]
    ),
    is_confirmed: schema.boolean.optional(),
    confirmation_token: schema.string.optional({ trim: true, escape: true }),
    remember_me: schema.string.optional({ trim: true, escape: true }),
  })
  public messages = {
    required: 'The field {{field}} is required',
    'email.email': 'The email must be valid',
    'password.confirmation': 'Passwords are not the same'
  }

  constructor (protected ctx: HttpContextContract) {
  }
}
