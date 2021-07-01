import {HttpContextContract} from "@ioc:Adonis/Core/HttpContext";
import Redis from "@ioc:Adonis/Addons/Redis";
import {UpdateGitHubReadme} from "App/Tasks/UpdateGithubReadme";

interface STATE {
  state: string
}

const STATES: Array<STATE> = [
  {state: 'developing'},
  {state: 'learning'},
  {state: 'listening_music'},
  {state: 'learning'}
]

export default class StatesController {

  public async get({response}: HttpContextContract) {
    const states = STATES.map(async state => {
      return this.getStatus(await Redis.get(`states:is_${state.state}`))
    })

    return response.status(200).send({
      states: {
        ...states
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
