import {HttpContextContract} from "@ioc:Adonis/Core/HttpContext";
import Redis from "@ioc:Adonis/Addons/Redis";
import StateSleepingValidator from "App/Validators/states/StateSleepingValidator";
import StateDevelopingValidator from "App/Validators/states/StateDevelopingValidator";

export default class StatesController {

  // Listening Music

  public async index ({ response }: HttpContextContract) {
    const sleeping = this.formatValue(Boolean(await Redis.get('states:sleeping')) || false)
    const developing = this.formatValue(Boolean(await Redis.get('states:developing')) || false)
    return response.status(200).send({
      sleeping,
      developing,
      listening_music: "Soon"
    })
  }

  public async setSleeping ({ request, response }: HttpContextContract) {
    const { value } = await request.validate(StateSleepingValidator)
    await Redis.set('states:sleeping', String(value))
    return response.status(200).send({
      message: 'State was successfully set!',
      value: this.formatValue(value)
    })
  }

  public async setDeveloping ({ request, response }: HttpContextContract) {
    const { value } = await request.validate(StateDevelopingValidator)
    await Redis.set('states:developing', String(value))
    return response.status(200).send({
      message: 'State was successfully set!',
      value: this.formatValue(value)
    })
  }

  public formatValue (value: boolean): string {
    return value ? 'Yes' : 'No'
  }

}
