import {HttpContextContract} from "@ioc:Adonis/Core/HttpContext";
import StateValidator from "App/Validators/state/StateValidator";
import Redis from "@ioc:Adonis/Addons/Redis";

export default class StatesController {

  public async get ({response}: HttpContextContract) {
    const is_sleeping = Boolean(await Redis.get('artapi/state/sleeping')) || false
    const is_learning = Boolean(await Redis.get('artapi/state/learning')) || false
    const is_developing = Boolean(await Redis.get('artapi/state/developing')) || false
    const is_listening_music = Boolean(await Redis.get('artapi/state/listening')) || false

    return response.status(200).send({
      is_sleeping,
      is_learning,
      is_developing,
      is_listening_music
    })
  }

  public async set ({request, response}: HttpContextContract) {
    const data = await request.validate(StateValidator)
    const { is_developing, is_learning, is_listening_music, is_sleeping } = data

    if (is_listening_music) {
      await Redis.set('artapi/state/listening', this.getState(is_listening_music))
    }
    if (is_developing) {
      await Redis.set('artapi/state/developing', this.getState(is_developing))
    }
    if (is_learning) {
      await Redis.set('artapi/state/learning', this.getState(is_learning))
    }
    if (is_sleeping) {
      await Redis.set('artapi/state/sleeping', this.getState(is_sleeping))
    }

    //Todo updateGitHub

    return response.status(200).send({
      message: 'States successfully modified !'
    })
  }

  getState(state: boolean):number {
    return state ? 1 : 0
  }

}
