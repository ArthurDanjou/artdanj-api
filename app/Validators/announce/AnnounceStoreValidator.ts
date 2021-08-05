import {schema} from '@ioc:Adonis/Core/Validator'
import {HttpContextContract} from '@ioc:Adonis/Core/HttpContext'

export default class AnnounceStoreValidator {
  public schema = schema.create({
    code: schema.string(),
    cover: schema.string.optional()
  })
  public messages = {
    required: 'The field {{ field }} is required'
  }

  constructor (protected ctx: HttpContextContract) {
  }
}
