import { schema } from '@ioc:Adonis/Core/Validator'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class FormationStoreValidator {
  constructor (protected ctx: HttpContextContract) {
  }

  public schema = schema.create({
    title: schema.string(),
    description: schema.string(),
    location: schema.string(),
    beginDate: schema.string(),
    endDate: schema.string()
  })

  public messages = {
    required: 'The field {{field}} is required'
  }
}
