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
    return response.status(200).send(await getCurrentPlayingFromCache())
  }

  public async getHistory({ request, response }: HttpContextContract) {
    const { range } = await request.validate(SongHistoryValidator)
    const history = await getHistory(range || 'day')
    return response.status(200).send({
      range: range || 'day',
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
    return response.redirect(getAuthorizationURI())
  }

  public async callback({ request, response }: HttpContextContract) {
    if (await setupSpotify(request.qs().code)) {
      return response.status(200).send({
        message: 'Athena successfully connected to Spotify',
      })
    }
  }
}
