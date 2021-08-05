import {HttpContextContract} from '@ioc:Adonis/Core/HttpContext'
import {rules, schema} from '@ioc:Adonis/Core/Validator'

export default class SubscriberStoreValidator {
  public schema = schema.create({
    email: schema.string({ trim: true }, [
      rules.email(),
      rules.unique({
        table: 'subscribers',
        column: 'email'
      })
    ])
  })
  public messages = {
    required: 'The field {{field}} is required'
  }

  constructor (protected ctx: HttpContextContract) {
  }
}
