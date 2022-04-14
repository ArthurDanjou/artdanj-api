import { schema } from '@ioc:Adonis/Core/Validator'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class SongRangeValidator {
  constructor(protected ctx: HttpContextContract) {
  }

  public schema = schema.create({
    range: schema.enum.optional(['short', 'medium', 'long'] as const),
  })

  public messages = {
    required: 'The field {{field}} is required',
  }
}
