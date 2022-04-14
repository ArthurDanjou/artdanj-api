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
    id: string
  }
  author: string
  duration: number
  image: {
    url: string
    width: number
    height: number
  }
}
