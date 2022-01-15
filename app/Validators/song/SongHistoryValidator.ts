import { schema } from '@ioc:Adonis/Core/Validator'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class SongHistoryValidator {
  constructor(protected ctx: HttpContextContract) {
  }

  public schema = schema.create({
    range: schema.enum(['day', 'week', 'month', 'total'] as const),
  })

  public messages = {
    required: 'The field {{field}} is required',
  }
}
