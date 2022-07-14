import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import {
  fetchTopArtist, fetchTopTracks,
  getAuthorizationURI,
  getCurrentPlayingFromCache,
  setupSpotify,
} from 'App/Utils/SongUtils'
import SongRangeValidator from 'App/Validators/song/SongRangeValidator'

export default class SongsController {
  public async getCurrentSong({ response }: HttpContextContract) {
    return response.status(200).send(await getCurrentPlayingFromCache())
  }

  public async getTopTrack({ request, response }: HttpContextContract) {
    const { range } = await request.validate(SongRangeValidator)
    return response.status(200).send({
      tracks: await fetchTopTracks(range || 'short'),
    })
  }

  public async getTopArtist({ request, response }: HttpContextContract) {
    const { range } = await request.validate(SongRangeValidator)
    return response.status(200).send({
      tracks: await fetchTopArtist(range || 'short'),
    })
  }

  public async authorize({ response }: HttpContextContract) {
    return response.redirect(getAuthorizationURI())
  }

  public async callback({ request, response }: HttpContextContract) {
    if (await setupSpotify(request.qs().code)) {
      return response.status(200).send({
        message: 'API successfully connected to Spotify',
      })
    }
  }
}
