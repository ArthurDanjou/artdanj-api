import Logger from '@ioc:Adonis/Core/Logger'

const MS = 1000

export async function getCurrentPlayingMusic(): Promise<void> {
  // Fetch from deezer
}

export async function Activate(): Promise<void> {
  Logger.info(`Starting task runner for watching deezer current playing [${MS} ms]`)
  await getCurrentPlayingMusic()
  setInterval(getCurrentPlayingMusic, MS)
}
