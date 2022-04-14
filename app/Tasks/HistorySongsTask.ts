import Logger from '@ioc:Adonis/Core/Logger'
import { getCurrentPlayingFromCache } from 'App/Utils/SongUtils'
import Song from 'App/Models/Song'

const MS = 3000 // 3 seconds
let taskId

async function LogSpotifyHistory(): Promise<void> {
  const current = await getCurrentPlayingFromCache()

  if (!current.is_playing) return

  if (current.progress && current.progress < 5000) return

  await Song.create({
    date: new Date(current.started_at!),
    duration: current.duration,
    item_name: current.name,
    item_type: current.type,
    item_id: current.id,
    author: current.author,
    device_name: current.device_name,
    device_type: current.device_type,
    image: current.image?.url,
  })
}

export async function Activate(): Promise<void> {
  Logger.info(`Starting task runner for tracking spotify listen history [${MS} ms]`)
  await LogSpotifyHistory()
  taskId = setInterval(LogSpotifyHistory, MS)
}

export function ShutDown(): void {
  clearInterval(taskId)
  Logger.info('Shutdown task runner for getting current developing state')
}
