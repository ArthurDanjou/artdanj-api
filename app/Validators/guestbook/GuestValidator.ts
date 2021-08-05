import {HttpContextContract} from '@ioc:Adonis/Core/HttpContext'
import {rules, schema} from '@ioc:Adonis/Core/Validator'

export default class GuestValidator {
  public messages = {
    required: 'The field {{field}} is required',
    'email.email': 'The email is not correct'
  }

  public schema = schema.create({
    message: schema.string({}, [
      rules.required()
    ]),
    email: schema.string({}, [
      rules.email()
    ])
  })

  constructor (protected ctx: HttpContextContract) {
  }
}
