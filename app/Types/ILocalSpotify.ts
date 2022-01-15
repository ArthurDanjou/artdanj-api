export interface SpotifyArtist {
  id: string
  name: string
  image: string
  genres: string[]
  popularity: number
  followers: number
}

export interface SpotifyTrack {
  item: {
    name: string
    type: string
  }
  device: {
    name: string
    type: string
  }
  author: string
  duration: number
  image: string
}
