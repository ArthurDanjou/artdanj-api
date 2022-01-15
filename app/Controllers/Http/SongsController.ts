import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import {
  fetchTopArtist,
  fetchTopTrack,
  getAuthorizationURI,
  getCurrentPlayingFromCache,
  getHistory,
  setupSpotify,
} from 'App/Utils/SongUtils'
import SongHistoryValidator from 'App/Validators/song/SongHistoryValidator'

export default class SongsController {
  public async getCurrentSong({ response }: HttpContextContract) {
    return response.status(200).send(getCurrentPlayingFromCache())
  }

  public async getHistory({ request, response }: HttpContextContract) {
    const { range } = await request.validate(SongHistoryValidator)
    const history = await getHistory(range)
    return response.status(200).send({
      history,
    })
  }

  public async getTopTrack({ response }: HttpContextContract) {
    return response.status(200).send({
      tracks: await fetchTopTrack(),
    })
  }

  public async getTopArtist({ response }: HttpContextContract) {
    return response.status(200).send({
      tracks: await fetchTopArtist(),
    })
  }

  public async authorize({ response }: HttpContextContract) {
    return response.status(200).redirect(getAuthorizationURI())
  }

  public async callback({ request }: HttpContextContract) {
    await setupSpotify(request.param('code'))
  }
}
