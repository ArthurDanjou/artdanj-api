import {HttpContextContract} from "@ioc:Adonis/Core/HttpContext";
import Redis from "@ioc:Adonis/Addons/Redis";
import {UpdateGitHubReadme} from "App/Tasks/UpdateGithubReadme";

export default class StatesController {

  public async get ({response}: HttpContextContract) {
    const is_sleeping = await Redis.get('states:sleeping')
    const is_listening_music = await Redis.get('states:listening')
    const is_developing = await Redis.get('states:developing')
    const is_learning = await Redis.get('states:learning')

    return response.status(200).send({
      is_learning: this.getStatus(is_learning),
      is_sleeping: this.getStatus(is_sleeping),
      is_developing: this.getStatus(is_developing),
      is_listening_music: this.getStatus(is_listening_music)
    })
  }

  public async set ({request, response, params}: HttpContextContract) {
    const state = params.state
    const value = await request.input('value')

    if (state && value) {
      await Redis.set(`states:${state}`, value)

      if (value === 'true') {
        switch (state) {
          case 'learning':
            await Redis.set(`states:developing`, 'false')
            await Redis.set(`states:sleeping`, 'false')
            break
          case 'developing':
            await Redis.set(`states:learning`, 'false')
            await Redis.set(`states:sleeping`, 'false')
            break
          case 'listening':
            await Redis.set(`states:sleeping`, 'false')
            break
          case 'sleeping':
            await Redis.set(`states:developing`, 'false')
            await Redis.set(`states:listening`, 'false')
            await Redis.set(`states:learning`, 'false')
            break
        }
      }

      await UpdateGitHubReadme()
      return response.status(200).send({
        message: 'State successfully updated !'
      })
    }
  }

  public getStatus(state: string | null): string {
    if (state === null) return "No"
    return state === 'true' ? "Yes" : "No"
  }

}
