import { schema } from '@ioc:Adonis/Core/Validator'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class SkillUpdateValidator {
  constructor(protected ctx: HttpContextContract) {
  }

  public schema = schema.create({
    name: schema.string.optional(),
    cover: schema.string.optional(),
    color: schema.string.optional(),
  })

  public messages = {
    required: 'The field {{field}} is required',
  }
}
