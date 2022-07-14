import { schema } from '@ioc:Adonis/Core/Validator'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class SkillStoreValidator {
  constructor(protected ctx: HttpContextContract) {
  }

  public schema = schema.create({
    name: schema.string(),
    cover: schema.string(),
    color: schema.string(),
  })

  public messages = {
    required: 'The field {{field}} is required',
  }
}
