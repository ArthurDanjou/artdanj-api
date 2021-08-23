import { schema } from '@ioc:Adonis/Core/Validator'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class MaintenanceUpdateValidator {
  constructor (protected ctx: HttpContextContract) {
  }

  public schema = schema.create({
    reason: schema.string.optional(),
    active: schema.boolean.optional()
  })

  public messages = {
    required: 'The field {{field}} is required'
  }
}
