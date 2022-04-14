export interface SpotifyToken {
  access_token: string
  refresh_token: string
}

interface Device {
  name: string
  type: 'computer' | 'smartphone' | 'speaker'
}

interface ExternalUrl {
  spotify: string
}

interface ExternalId {
  isrc: string
  ean: string
  upc: string
}

interface Image {
  url: string
  width: number
  height: number
}

interface Restriction {
  reason: 'market' | 'explicit' | 'product'
}

interface Follower {
  href: string
  total: number
}

export interface Artist {
  external_urls: ExternalUrl
  followers: Follower
  genres: string[]
  href: string
  id: string
  images: Image[]
  name: string
  popularity: number
  type: string
  uri: string
}

interface Album {
  album_type: 'single' | 'album' | 'compilation'
  total_tracks: number
  available_markets: string[]
  external_urls: ExternalUrl
  href: string
  id: string
  images: Image[]
  name: string
  release_date: string
  release_date_precision: 'day' | 'month' | 'year'
  restrictions: Restriction
  type: string
  uri: string
}

export interface Item {
  album: Album & { album_group: 'album' | 'single' | 'compilation' | 'appears_on' ; artists: Artist[] }
  artists: Artist[]
  available_markets: string[]
  disc_number: number
  duration_ms: number
  explicit: boolean
  external_ids: ExternalId
  external_urls: ExternalUrl
  href: string
  id: string
  is_playable: boolean
  restrictions: Restriction
  name: string
  popularity: number
  preview_url: string
  track_number: number
  type: string
  uri: string
  is_local: boolean
  device: Device
}

export interface PlayerResponse {
  device: Device
  timestamp: number
  is_playing: boolean
  item: Item
  progress_ms: number
  shuffle_state: string
  repeat_state: string
  currently_playing_type: 'track' | 'episode' | 'ad' | 'unknown'
}

export interface InternalPlayerResponse {
  is_playing: boolean
  device_name?: string
  device_type?: string
  name?: string
  type?: string
  author?: string
  id?: string
  image?: Image
  progress?: number
  duration?: number
  started_at?: number
}
