import {schema} from '@ioc:Adonis/Core/Validator'
import {HttpContextContract} from '@ioc:Adonis/Core/HttpContext'

export default class ProjectUpdateValidator {
  public schema = schema.create({
    name: schema.string.optional(),
    description: schema.string.optional(),
    progress: schema.number.optional(),
    url: schema.string.optional(),
    cover: schema.string.optional(),
    tags: schema.array.optional().members(schema.string())
  })
  public messages = {
    required: 'The field {{field}} is required'
  }

  constructor (protected ctx: HttpContextContract) {
  }
}
