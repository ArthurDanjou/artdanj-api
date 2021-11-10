import { schema } from '@ioc:Adonis/Core/Validator'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class ProjectStoreValidator {
  constructor(protected ctx: HttpContextContract) {
  }

  public schema = schema.create({
    name: schema.string(),
    description: schema.string(),
    url: schema.string(),
    cover: schema.string(),
    tags: schema.array.optional().members(schema.string()),
  })

  public messages = {
    required: 'The field {{field}} is required',
  }
}
