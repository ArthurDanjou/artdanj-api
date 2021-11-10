import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Redis from '@ioc:Adonis/Addons/Redis'
import StateSleepingValidator from 'App/Validators/states/StateSleepingValidator'

export default class StatesController {
  // Listening Music

  public async index({ response }: HttpContextContract) {
    const sleeping = this.formatValue(await Redis.get('states:sleeping'))
    const developing = this.formatValue(await Redis.get('states:developing'))
    return response.status(200).send({
      sleeping,
      developing,
      listening_music: 'Soon',
    })
  }

  public async setSleeping({ request, response }: HttpContextContract) {
    const { value } = await request.validate(StateSleepingValidator)
    await Redis.set('states:sleeping', String(value))
    await Redis.set('states:developing', String(!value))
    return response.status(200).send({
      message: 'State was successfully set!',
      value: this.formatValue(String(value)),
    })
  }

  public formatValue(value: string | null): string {
    return value === 'true' ? 'Yes' : 'No'
  }
}
