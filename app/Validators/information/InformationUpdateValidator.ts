import {schema} from '@ioc:Adonis/Core/Validator'
import {HttpContextContract} from '@ioc:Adonis/Core/HttpContext'

export default class InformationUpdateValidator {
  public schema = schema.create({
    age: schema.number.optional(),
    code: schema.string.optional(),
    hiring_color: schema.string.optional()
  })
  public messages = {
    required: 'The field {{field}} is required'
  }

  constructor (protected ctx: HttpContextContract) {
  }
}