import {schema} from '@ioc:Adonis/Core/Validator'
import {HttpContextContract} from '@ioc:Adonis/Core/HttpContext'

export default class PostUpdateValidator {

  public schema = schema.create({
    slug: schema.string.optional(),
    likes: schema.number.optional(),
    tags: schema.array.optional().members(schema.string())
  })
  public messages = {
    required: 'The field {{field}} is required'
  }

  constructor (protected ctx: HttpContextContract) {
  }
}
