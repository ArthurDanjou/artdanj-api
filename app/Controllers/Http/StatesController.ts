import {HttpContextContract} from "@ioc:Adonis/Core/HttpContext";
import Redis from "@ioc:Adonis/Addons/Redis";
import {UpdateGitHubReadme} from "App/tasks/UpdateGithubReadme";

export default class StatesController {

  public async get ({response}: HttpContextContract) {
    const is_sleeping = await Redis.get('artapi/states/sleeping') || "false"
    const is_learning = await Redis.get('artapi/states/learning') || "false"
    const is_developing = await Redis.get('artapi/states/developing') || "false"
    const is_listening_music = await Redis.get('artapi/states/listening') || "false"

    return response.status(200).send({
      is_sleeping: this.getStatus(is_sleeping),
      is_learning: this.getStatus(is_learning),
      is_developing: this.getStatus(is_developing),
      is_listening_music: this.getStatus(is_listening_music)
    })
  }

  public async setSleepingStatus ({request, response}: HttpContextContract) {
    const sleeping = await request.input('sleeping')
    await Redis.set('artapi/states/sleeping', sleeping)
    await UpdateGitHubReadme()
    return response.status(200).send({
      message: 'State successfully updated !'
    })
  }

  public async setDevelopingStatus ({request, response}: HttpContextContract) {
    const developing = await request.input('developing')
    await Redis.set('artapi/states/developing', developing)
    await UpdateGitHubReadme()
    return response.status(200).send({
      message: 'State successfully updated !'
    })
  }

  public async setLearningStatus ({request, response}: HttpContextContract) {
    const learning = await request.input('learning')
    await Redis.set('artapi/states/learning', learning)
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

  private getStatus(state: string) {
    return state === "true"
  }

}
