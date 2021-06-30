import { schema } from '@ioc:Adonis/Core/Validator'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class FormValidator {
  constructor (protected ctx: HttpContextContract) {
  }

  public schema = schema.create({
    name: schema.string(),
    email: schema.string(),
    subject: schema.string(),
    content: schema.string()
  })

  public messages = {}
}
