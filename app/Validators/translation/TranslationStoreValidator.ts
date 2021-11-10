import { rules, schema } from '@ioc:Adonis/Core/Validator'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class TranslationStoreValidator {
  public schema = schema.create({
    code: schema.string({}, [
      rules.unique({
        table: 'translations',
        column: 'code',
      }),
    ]),
    english: schema.string.optional(),
    french: schema.string.optional(),
  })

  public messages = {
    'required': 'The field {{field}} is required',
    'code.unique': 'The translation code is not unique !',
  }

  constructor(protected ctx: HttpContextContract) {
  }
}
