import { schema } from '@ioc:Adonis/Core/Validator'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class PostUpdateValidator {
  public schema = schema.create({
    slug: schema.string.optional(),
    likes: schema.number.optional(),
    tags: schema.array.optional().members(schema.string()),
    title: schema.string.optional(),
    description: schema.string.optional(),
    cover: schema.string.optional(),
    readingTime: schema.number.optional(),
    date: schema.string.optional(),
    color: schema.string.optional(),
    content: schema.string.optional(),
  })

  public messages = {
    required: 'The field {{field}} is required',
  }

  constructor(protected ctx: HttpContextContract) {
  }
}
