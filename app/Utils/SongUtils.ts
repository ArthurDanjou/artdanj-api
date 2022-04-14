import axios, { AxiosRequestConfig, AxiosResponse } from 'axios'
import Env from '@ioc:Adonis/Core/Env'
import Redis from '@ioc:Adonis/Addons/Redis'
import { SpotifyArtist, SpotifyTrack } from 'App/Types/ILocalSpotify'
import { Artist, InternalPlayerResponse, Item, PlayerResponse, SpotifyToken } from 'App/Types/ISpotify'
import queryString from 'query-string'
import { updateGithubReadmeSpotify } from 'App/Utils/UpdateGithubReadme'

type Range = 'short' | 'medium' | 'long'

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
      access_token: authorization_tokens.data.access_token,
      refresh_token,
    })
  }
}

async function RequestWrapper<T = never>(url: string): Promise<AxiosResponse<T> | undefined> {
  const options: AxiosRequestConfig = {
    headers: {
      Authorization: `Bearer ${(await getSpotifyAccount()).access_token}`,
    },
  }

  try {
    return await axios.get<T>(url, options)
  }
  catch (error) {
    await regenerateTokens()
    return RequestWrapper<T>(url)
  }
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
      author: current_track.data.item.artists.map(artist => artist.name).join(', ') || '',
      id: current_track.data.item.id,
      image: current_track.data.item.album.images[0],
      duration: current_track.data.item.duration_ms,
      started_at: current_track.data.timestamp,
    }
  }
  else {
    current = { is_playing: false }
  }

  const old_track: InternalPlayerResponse = JSON.parse(await Redis.get('spotify:current') || '{}')
  if (old_track.is_playing !== current.is_playing || old_track.name !== current.name)
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
  // console.log(changed)
  // todo send message to Rabbit
}

function getTermForRange(range: Range): String {
  return `${range}_term`
}

export async function fetchTopTracks(range: Range) {
  if (await Redis.exists(`spotify:top:tracks:${range || 'short'}`))
    return JSON.parse(await Redis.get(`spotify:top:tracks:${range || 'short'}`) || '{}')

  const fetched_tracks = await RequestWrapper<{ items: Item[] }>(`https://api.spotify.com/v1/me/top/tracks?limit=10?range=${getTermForRange(range)}`)

  const tracks: SpotifyTrack[] = []

  if (fetched_tracks) {
    for (const track of fetched_tracks.data.items) {
      tracks.push({
        author: track.artists.map(artist => artist.name).join(', ') || '',
        device: {
          name: track.device.name,
          type: track.device.type,
        },
        image: track.album.images[0].url,
        item: {
          name: track.name,
          type: track.type,
          id: track.id,
        },
        duration: track.duration_ms,
      })
    }
  }
  else {
    return {
      tracks: 'cannot_fetch_tracks',
    }
  }

  await Redis.set(`spotify:top:tracks:${range || 'short'}`, JSON.stringify({
    cached: new Date().toUTCString(),
    expiration: new Date(new Date().setMinutes(new Date().getMinutes() + 5)).toUTCString(),
    top: tracks,
  }), 'ex', 300)

  return tracks
}

export async function fetchTopArtist(range: Range): Promise<SpotifyArtist[] | { artists: string }> {
  if (await Redis.exists('spotify:top:artists'))
    return JSON.parse(await Redis.get('spotify:top:artists') || '{}')

  const fetched_artists = await RequestWrapper<{ items: Artist[] }>(`https://api.spotify.com/v1/me/top/artists?limit=10?range=${getTermForRange(range)}`)

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
