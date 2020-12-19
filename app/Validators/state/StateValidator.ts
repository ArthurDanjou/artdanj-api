import { schema } from '@ioc:Adonis/Core/Validator'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class StateValidator {
  constructor (protected ctx: HttpContextContract) {
  }

  public schema = schema.create({
    is_sleeping: schema.boolean.optional(),
    is_learning: schema.boolean.optional(),
    is_developing: schema.boolean.optional(),
    is_listening_music: schema.boolean.optional(),
  })


  public messages = {}
}
