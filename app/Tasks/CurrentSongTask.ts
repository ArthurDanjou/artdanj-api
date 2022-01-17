import Logger from '@ioc:Adonis/Core/Logger'
import { getCurrentPlayingFromSpotify, getSpotifyAccount } from 'App/Utils/SongUtils'

const MS = 1000
let taskId

async function SpotifyCurrentListeningWatcher(): Promise<void> {
  if ((await getSpotifyAccount()).access_token === '') return
  await getCurrentPlayingFromSpotify()
}

export async function Activate(): Promise<void> {
  Logger.info(`Starting task runner for watching spotify current playing [${MS} ms]`)
  await SpotifyCurrentListeningWatcher()
  taskId = setInterval(SpotifyCurrentListeningWatcher, MS)
}

export function ShutDown(): void {
  clearInterval(taskId)
  Logger.info('Shutdown task runner for getting current developing state')
}
