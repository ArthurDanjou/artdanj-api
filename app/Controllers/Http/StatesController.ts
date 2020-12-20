import {HttpContextContract} from "@ioc:Adonis/Core/HttpContext";
import Redis from "@ioc:Adonis/Addons/Redis";
import {UpdateGitHubReadme} from "App/tasks/UpdateGithubReadme";

export default class StatesController {

  public async get ({response}: HttpContextContract) {
    const is_sleeping = Boolean(await Redis.get('artapi/states/sleeping')) || false
    const is_learning = Boolean(await Redis.get('artapi/states/learning')) || false
    const is_developing = Boolean(await Redis.get('artapi/states/developing')) || false
    const is_listening_music = Boolean(await Redis.get('artapi/states/listening')) || false

    return response.status(200).send({
      is_sleeping,
      is_learning,
      is_developing,
      is_listening_music
    })
  }

  public async setSleepingStatus ({request, response}: HttpContextContract) {
    const sleeping = await request.input('sleeping')
    await Redis.set('artapi/states/sleeping', this.getState(sleeping))
    await UpdateGitHubReadme()
    return response.status(200).send({
      message: 'State successfully updated !'
    })
  }

  public async setDevelopingStatus ({request, response}: HttpContextContract) {
    const developing = await request.input('developing')
    await Redis.set('artapi/states/developing', this.getState(developing))
    await UpdateGitHubReadme()
    return response.status(200).send({
      message: 'State successfully updated !'
    })
  }

  public async setLearningStatus ({request, response}: HttpContextContract) {
    const learning = await request.input('learning')
    await Redis.set('artapi/states/learning', this.getState(learning))
    await UpdateGitHubReadme()
    return response.status(200).send({
      message: 'State successfully updated !'
    })
  }

  public async setListeningStatus ({request, response}: HttpContextContract) {
    const listening = await request.input('listening')
    await Redis.set('artapi/states/listening', listening)
    await UpdateGitHubReadme()
    return response.status(200).send({
      message: 'State successfully updated !'
    })
  }

  getState(state: boolean):number {
    return state ? 1 : 0
  }

}
