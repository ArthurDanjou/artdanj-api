import Logger from '@ioc:Adonis/Core/Logger'
import { getCurrentPlayingFromSpotify } from 'App/Utils/SongUtils'

const MS = 1000
let taskId

export async function Activate(): Promise<void> {
  Logger.info(`Starting task runner for watching spotify current playing [${MS} ms]`)
  await getCurrentPlayingFromSpotify()
  taskId = setInterval(getCurrentPlayingFromSpotify, MS)
}

export function ShutDown(): void {
  clearInterval(taskId)
  Logger.info('Shutdown task runner for getting current developing state')
}
