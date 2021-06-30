import { schema } from '@ioc:Adonis/Core/Validator'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class ProjectValidator {
  constructor (protected ctx: HttpContextContract) {
  }

  public schema = schema.create({
    name: schema.string(),
    description: schema.string(),
    progress: schema.number(),
    url: schema.string()
  })


  public messages = {
    required: 'Le champ {{field}} doit être valide !',
  }
}
