import { schema } from '@ioc:Adonis/Core/Validator'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class ExperienceStoreValidator {
  constructor(protected ctx: HttpContextContract) {
  }

  public schema = schema.create({
    title: schema.string(),
    company: schema.string(),
    location: schema.string(),
    beginDate: schema.string(),
    endDate: schema.string(),
  })

  public messages = {
    required: 'The field {{field}} is required',
  }
}
