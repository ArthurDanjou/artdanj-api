import {schema} from '@ioc:Adonis/Core/Validator'
import {HttpContextContract} from '@ioc:Adonis/Core/HttpContext'

export default class PostStoreValidator {

  public schema = schema.create({
    slug: schema.string(),
    likes: schema.number(),
    tags: schema.array().members(schema.string()),
    title: schema.string(),
    description: schema.string(),
    cover: schema.string(),
    readingTime: schema.number(),
    date: schema.string(),
    color: schema.string(),
    content: schema.string()
  })
  public messages = {
    required: 'The field {{field}} is required'
  }

  constructor (protected ctx: HttpContextContract) {
  }
}
