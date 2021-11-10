import { schema } from '@ioc:Adonis/Core/Validator'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class ExperienceUpdateValidator {
  constructor(protected ctx: HttpContextContract) {
  }

  public schema = schema.create({
    title: schema.string.optional(),
    company: schema.string.optional(),
    location: schema.string.optional(),
    beginDate: schema.string.optional(),
    endDate: schema.string.optional(),
  })

  public messages = {
    required: 'The field {{field}} is required',
  }
}
