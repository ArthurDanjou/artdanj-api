import { readFileSync, writeFileSync } from 'fs'
import axios, { AxiosRequestConfig, AxiosResponse } from 'axios'
import Env from '@ioc:Adonis/Core/Env'
import Redis from '@ioc:Adonis/Addons/Redis'
import { SpotifyArtist, SpotifyTrack } from 'App/Types/ILocalSpotify'
import { Artist, InternalPlayerResponse, PlayerResponse, SpotifyToken } from 'App/Types/ISpotify'
import Song from 'App/Models/Song'
import Logger from '@ioc:Adonis/Core/Logger'

export function getSpotifyAccount(): { access: string; refresh: string } {
  Logger.info(JSON.parse(readFileSync('spotify.json').toString()))
  return JSON.parse(readFileSync('spotify.json').toString())
}

export function getAuthorizationURI(): string {
  const query = JSON.stringify({
    response_type: 'code',
    client_id: Env.get('SPOTIFY_ID'),
    scope: encodeURIComponent('user-read-playback-state user-read-currently-playing'),
    redirect_uri: `${Env.get('BASE_URL')}/spotify/callback`,
  })

  Logger.info(`https://accounts.spotify.com/authorize?${query}`)
  return `https://accounts.spotify.com/authorize?${query}`
}

export async function setupSpotify(code: string): Promise<void> {
  const authorization_tokens: AxiosResponse<SpotifyToken> = await axios.post(
    'https://accounts.spotify.com/api/token',
    {
      code,
      grant_type: 'authorization_code',
      redirect_uri: `${Env.get('BASE_URL')}/spotify/callback`,
    },
    {
      headers: {
        'Authorization': `Basic ${Buffer.from(`${Env.get('SPOTIFY_ID')}:${Env.get('SPOTIFY_SECRET')}`).toString('base64')}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    },
  )

  Logger.info(String(authorization_tokens))

  if (authorization_tokens.status === 200) {
    writeFileSync(
      'spotify.json',
      JSON.stringify({
        access: authorization_tokens.data.access_token,
        refresh: authorization_tokens.data.refresh_token,
      }),
    )
  }
}

export async function regenerateTokens(): Promise<void> {
  const refresh_token = getSpotifyAccount().refresh
  Logger.info(refresh_token)

  const authorization_tokens: AxiosResponse<SpotifyToken> = await axios.post(
    'https://accounts.spotify.com/api/token',
    {
      grant_type: 'refresh_token',
      refresh_token,
    },
    {
      headers: {
        'Authorization': `Basic ${Buffer.from(`${Env.get('SPOTIFY_ID')}:${Env.get('SPOTIFY_SECRET')}`).toString('base64')}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    },
  )

  Logger.info(String(authorization_tokens))
  if (authorization_tokens.status === 200) {
    writeFileSync(
      'spotify.json',
      JSON.stringify({
        access: authorization_tokens.data.access_token,
        refresh: authorization_tokens.data.refresh_token,
      }),
    )
  }
}

async function RequestWrapper<T = never>(url: string): Promise<AxiosResponse<T>> {
  let request
  const options: AxiosRequestConfig = {
    headers: {
      Authorization: `Bearer ${getSpotifyAccount().access}`,
    },
  }
  request = await axios.get<T>(url, options)

  if (request.status === 401) {
    await regenerateTokens()
    request = await axios.get<T>(url, options)
  }
  return request
}

export async function getCurrentPlayingFromCache(): Promise<InternalPlayerResponse> {
  return JSON.parse(await Redis.get('spotify:current') || '') || { is_playing: false }
}

export async function getCurrentPlayingFromSpotify(): Promise<InternalPlayerResponse> {
  const current_track = await RequestWrapper<PlayerResponse>('https://api.spotify.com/v1/me/player?additional_types=track,episode')

  let current: InternalPlayerResponse

  if (current_track.data && !['track', 'episode'].includes(current_track.data.currently_playing_type))
    current = { is_playing: false }

  if (current_track.data && current_track.data.is_playing) {
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

export async function updateCurrentSong(song: InternalPlayerResponse): Promise<void> {
  // const current = JSON.parse(await Redis.get('spotify/current') as string)
  await Redis.set('spotify:current', JSON.stringify(song))

  // const changed = diff(current, song)
  // todo send message to Rabbit
}

export async function getHistory(range: 'day' | 'week' | 'month' | 'total') {
  if (await Redis.exists(`spotify:history:range:${range || 'day'}`))
    return JSON.parse(await Redis.get(`spotify:history:range:${range || 'day'}`) || '')

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
    history: songs,
  }), 'ex', 300)

  return { history: songs }
}

export async function fetchTopArtist(): Promise<SpotifyArtist[]> {
  if (await Redis.exists('spotify:top:artists'))
    return JSON.parse(await Redis.get('spotify:top:artists') || '')

  const fetched_artists = await RequestWrapper<{ items: Artist[] }>('https://api.spotify.com/v1/me/top/type/artists?limit=5')

  const artists: SpotifyArtist[] = []

  if (fetched_artists.data) {
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
    return []
  }

  await Redis.set('spotify:top:artists', JSON.stringify({
    cached: new Date().toUTCString(),
    top: artists,
  }), 'ex', 600)

  return artists
}

export async function fetchTopTrack(): Promise<SpotifyTrack[]> {
  if (await Redis.exists('spotify:top:tracks'))
    return JSON.parse(await Redis.get('spotify:top:tracks') || '')

  const fetched_tracks = await Song
    .query()
    .orderBy('date', 'desc')
    .limit(5)

  const tracks: SpotifyTrack[] = []

  if (fetched_tracks.length >= 0) {
    for (const track of fetched_tracks) {
      tracks.push({
        item: {
          name: track.item_name,
          type: track.item_type,
        },
        device: {
          name: track.device_name,
          type: track.device_type,
        },
        duration: track.duration,
        author: track.author,
        image: track.image,
      })
    }
  }
  else {
    return []
  }

  await Redis.set('spotify:top:tracks', JSON.stringify({
    cached: new Date().toUTCString(),
    top: tracks,
  }), 'ex', 300)

  return tracks
}
