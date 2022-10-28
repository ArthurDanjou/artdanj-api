import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Redis from '@ioc:Adonis/Addons/Redis'
import StateValidator from 'App/Validators/states/StateValidator'
import { getCurrentPlayingFromCache } from 'App/Utils/SongUtils'

export default class StatesController {
  public async index({ response }: HttpContextContract) {
    const sleep = this.formatValue(await Redis.get('states:sleeping'))
    const develop = this.formatValue(await Redis.get('states:developing'))
    const sport = this.formatValue(await Redis.get('states:sporting'))
    return response.status(200).send({
      is_sleeping: sleep,
      is_developing: develop,
      is_sporting: sport,
      listening_music: await getCurrentPlayingFromCache(),
    })
  }

  public async setSleep({ request, response }: HttpContextContract) {
    const { value } = await request.validate(StateValidator)
    await Redis.set('states:sleeping', String(value))
    await Redis.set('states:developing', String(!value))
    return response.status(200).send({
      message: 'State was successfully set!',
      value: this.formatValue(String(value)),
    })
  }

  public async setSport({ request, response }: HttpContextContract) {
    const { value } = await request.validate(StateValidator)
    await Redis.set('states:sporting', String(value))
    await Redis.set('states:sleeping', String(!value))
    return response.status(200).send({
      message: 'State was successfully set!',
      value: this.formatValue(String(value)),
    })
  }

  public formatValue(value: string | null): string {
    return value === 'true' ? 'Yes' : 'No'
  }
}
