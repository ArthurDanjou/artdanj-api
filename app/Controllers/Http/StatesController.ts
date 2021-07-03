import {HttpContextContract} from "@ioc:Adonis/Core/HttpContext";
import Redis from "@ioc:Adonis/Addons/Redis";
import {UpdateGitHubReadme} from "App/Tasks/UpdateGithubReadme";

export default class StatesController {

  public async get({response}: HttpContextContract) {

    return response.status(200).send({
      states: {
        "is_sleeping": this.getStatus(await Redis.get(`states:is_sleeping`)),
        "is_developing": this.getStatus(await Redis.get(`states:is_developing`)),
        "is_learning": this.getStatus(await Redis.get(`states:is_learning`)),
        "is_listening_music": this.getStatus(await Redis.get(`states:is_listening_music`)),
      }
    })
  }

  public async set({request, response, params}: HttpContextContract) {
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
        message: 'State successfully updated!'
      })
    }
  }

  public getStatus(state: string | null): string {
    if (state === null) return "No"
    return state === 'true' ? "Yes" : "No"
  }

}
