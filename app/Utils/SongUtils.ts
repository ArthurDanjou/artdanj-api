import axios, { AxiosRequestConfig, AxiosResponse } from 'axios'
import Env from '@ioc:Adonis/Core/Env'
import Redis from '@ioc:Adonis/Addons/Redis'
import { SpotifyArtist, SpotifyTrack } from 'App/Types/ILocalSpotify'
import { Artist, InternalPlayerResponse, PlayerResponse, SpotifyToken } from 'App/Types/ISpotify'
import Song from 'App/Models/Song'
import queryString from 'query-string'
import { updateGithubReadmeSpotify } from 'App/Utils/UpdateGithubReadme'

export async function getSpotifyAccount(): Promise<SpotifyToken> {
  return await Redis.exists('spotify:account')
    ? JSON.parse(await Redis.get('spotify:account') || '{}')
    : {
      access_token: '',
      refresh_token: '',
    }
}

export async function setSpotifyAccount(token: SpotifyToken): Promise<void> {
  await Redis.set('spotify:account', JSON.stringify({
    access_token: token.access_token,
    refresh_token: token.refresh_token,
  }))
}

export function getAuthorizationURI(): string {
  const query = queryString.stringify({
    response_type: 'code',
    client_id: Env.get('SPOTIFY_ID'),
    scope: encodeURIComponent('user-read-playback-state user-read-currently-playing user-top-read'),
    redirect_uri: `${Env.get('BASE_URL')}/spotify/callback`,
  })

  return `https://accounts.spotify.com/authorize?${query}`
}

export async function setupSpotify(code: string): Promise<boolean> {
  const authorization_tokens: AxiosResponse<SpotifyToken> = await axios.post(
    'https://accounts.spotify.com/api/token',
    queryString.stringify({
      code,
      grant_type: 'authorization_code',
      redirect_uri: `${Env.get('BASE_URL')}/spotify/callback`,
    }),
    {
      headers: {
        'Authorization': `Basic ${Buffer.from(`${Env.get('SPOTIFY_ID')}:${Env.get('SPOTIFY_SECRET')}`).toString('base64')}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    },
  )

  if (authorization_tokens.status === 200)
    await setSpotifyAccount(authorization_tokens.data)

  return true
}

export async function regenerateTokens(): Promise<void> {
  const refresh_token = (await getSpotifyAccount()).refresh_token

  const authorization_tokens: AxiosResponse<SpotifyToken> = await axios.post(
    'https://accounts.spotify.com/api/token',
    queryString.stringify({
      grant_type: 'refresh_token',
      refresh_token,
    }),
    {
      headers: {
        'Authorization': `Basic ${Buffer.from(`${Env.get('SPOTIFY_ID')}:${Env.get('SPOTIFY_SECRET')}`).toString('base64')}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    },
  )

  if (authorization_tokens.status === 200) {
    await setSpotifyAccount({
      access_token: (await getSpotifyAccount()).access_token,
      refresh_token: authorization_tokens.data.access_token,
    })
  }
}

async function RequestWrapper<T = never>(url: string): Promise<AxiosResponse<T> | undefined> {
  let request
  const options: AxiosRequestConfig = {
    headers: {
      Authorization: `Bearer ${(await getSpotifyAccount()).access_token}`,
    },
  }
  try {
    request = await axios.get<T>(url, options)
  }
  catch (error) {
    await regenerateTokens()
    request = await axios.get<T>(url, options)
  }

  if (request.status === 200)
    return request
}

export async function getCurrentPlayingFromCache(): Promise<InternalPlayerResponse> {
  return JSON.parse(await Redis.get('spotify:current') || '{}') || { is_playing: false }
}

export async function getCurrentPlayingFromSpotify(): Promise<InternalPlayerResponse> {
  if ((await getSpotifyAccount()).access_token === '') return { is_playing: false }
  const current_track = await RequestWrapper<PlayerResponse>('https://api.spotify.com/v1/me/player?additional_types=track,episode')

  let current: InternalPlayerResponse

  if (current_track && current_track.data && current_track.data.is_playing) {
    current = {
      is_playing: true,
      device_name: current_track.data.device.name,
      device_type: current_track.data.device.type,
      name: current_track.data.item.name,
      type: current_track.data.item.type,
      author: current_track.data.item.artists.map(artist => artist.name).join(', '),
      id: current_track.data.item.id,
      image: current_track.data.item.album.images[0],
      progress: current_track.data.progress_ms,
      duration: current_track.data.item.duration_ms,
      started_at: current_track.data.timestamp,
    }
  }
  else {
    current = { is_playing: false }
  }

  if ((await Redis.get('spotify:current') as string) !== JSON.stringify(current))
    await updateCurrentSong(current)

  return current
}

export async function resetCurrentSongCache(): Promise<void> {
  await updateCurrentSong({ is_playing: false })
}

export async function updateCurrentSong(song: InternalPlayerResponse): Promise<void> {
  // const current = JSON.parse(await Redis.get('spotify/current') as string)
  await Redis.set('spotify:current', JSON.stringify(song))
  await updateGithubReadmeSpotify()

  // const changed = diff(current, song)
  // todo send message to Rabbit
}

export async function getHistory(range: 'day' | 'week' | 'month' | 'total') {
  if (await Redis.exists(`spotify:history:range:${range || 'day'}`))
    return JSON.parse(await Redis.get(`spotify:history:range:${range || 'day'}`) || '{}')

  let startDate = new Date(new Date().getTime() - 24 * 60 * 60 * 1000)
  if (range === 'week') startDate = new Date(new Date().getTime() - 7 * 24 * 60 * 60 * 1000)
  else if (range === 'month') startDate = new Date(new Date().setMonth(new Date().getMonth() - 1))

  const endDate = new Date()

  const songs = await Song
    .query()
    .where('date', '<=', endDate)
    .where('date', '>=', startDate)
    .orderBy('date', 'desc')

  if (songs.length <= 0)
    return { history: 'no_tracks_in_that_range' }

  await Redis.set(`spotify:history:range:${range || 'day'}`, JSON.stringify({
    cached: new Date().toUTCString(),
    expiration: new Date(new Date().setMinutes(new Date().getMinutes() + 5)).toUTCString(),
    history: songs,
  }), 'ex', 300)

  return { history: songs }
}

export async function fetchTopArtist(): Promise<SpotifyArtist[] | { artists: string }> {
  if (await Redis.exists('spotify:top:artists'))
    return JSON.parse(await Redis.get('spotify:top:artists') || '{}')

  const fetched_artists = await RequestWrapper<{ items: Artist[] }>('https://api.spotify.com/v1/me/top/artists?limit=10')

  const artists: SpotifyArtist[] = []

  if (fetched_artists) {
    for (const artist of fetched_artists.data.items) {
      artists.push({
        id: artist.id,
        image: artist.images[0].url,
        name: artist.name,
        followers: artist.followers.total,
        genres: artist.genres,
        popularity: artist.popularity,
      })
    }
  }
  else {
    return {
      artists: 'cannot_fetch_artists',
    }
  }

  await Redis.set('spotify:top:artists', JSON.stringify({
    cached: new Date().toUTCString(),
    expiration: new Date(new Date().setMinutes(new Date().getMinutes() + 5)).toUTCString(),
    top: artists,
  }), 'ex', 300)

  return artists
}

export async function fetchTopTrack(): Promise<Array<SpotifyTrack & { times: number }>> {
  if (await Redis.exists('spotify:top:tracks'))
    return JSON.parse(await Redis.get('spotify:top:tracks') || '{}')

  // Fetch all songs
  const fetched_tracks = await Song.query()

  if (fetched_tracks.length <= 0)
    return []

  const filtered = fetched_tracks.map((track) => {
    return {
      ...{
        item: {
          name: track.item_name,
          type: track.item_type,
          id: track.item_id,
        },
        device: {
          name: track.device_name,
          type: track.device_type,
        },
        duration: track.duration,
        author: track.author,
        image: track.image,
      },
      times: fetched_tracks.filter(i => i.item_id === track.item_id).length,
    }
  })

  const sorted = filtered.sort((itemA, itemB) => itemB.times - itemA.times)

  const remove_dupes = sorted.filter((thing, index, self) => index === self.findIndex(t => t.item.id === thing.item.id)).slice(0, 10)

  await Redis.set('spotify:top:tracks', JSON.stringify({
    cached: new Date().toUTCString(),
    expiration: new Date(new Date().setMinutes(new Date().getMinutes() + 5)).toUTCString(),
    top: remove_dupes,
  }), 'ex', 300)

  return remove_dupes
}
