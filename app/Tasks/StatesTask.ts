import Logger from '@ioc:Adonis/Core/Logger'
import { fetchDevelopingState } from 'App/Utils/StatesTask'

const MS = 1000 * 2 * 60 // 2 min
let taskId

export async function Activate(): Promise<void> {
  Logger.info(`Starting task runner for getting current developing state [every ${MS} ms]`)
  await fetchDevelopingState()
  taskId = setInterval(fetchDevelopingState, MS)
}

export function ShutDown(): void {
  clearInterval(taskId)
  Logger.info('Shutdown task runner for getting current developing state')
}
