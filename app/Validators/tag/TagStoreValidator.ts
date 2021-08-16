import { schema } from '@ioc:Adonis/Core/Validator'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class TagStoreValidator {
  constructor (protected ctx: HttpContextContract) {
  }

  public schema = schema.create({
    label: schema.string()
  })

  public messages = {
    required: 'The field {{field}} is required',
  }
}
