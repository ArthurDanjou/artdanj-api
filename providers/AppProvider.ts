import { ApplicationContract } from '@ioc:Adonis/Core/Application'
import Logger from '@ioc:Adonis/Core/Logger'

export default class AppProvider {
  public static needsApplication = true

  constructor(protected app: ApplicationContract) {
  }

  public register() {
    // Register your own bindings
  }

  public async boot() {
    // IoC container is ready
    Logger.info('Application is booting. Please wait...')
  }

  public async ready() {
    // App is ready
    const StatsTask = await import('App/Tasks/StatsTask')
    const StatesTask = await import('App/Tasks/StatesTask')
    // const CurrentSongTask = await import('App/Tasks/CurrentSongTask')
    // const HistorySongsTask = await import('App/Tasks/HistorySongsTask')

    await StatsTask.Activate()
    await StatesTask.Activate()
    // await CurrentSongTask.Activate()
    // await HistorySongsTask.Activate()

    Logger.info('Application is ready!')
  }

  public async shutdown() {
    // Cleanup, since app is going down
    const StatsTask = await import('App/Tasks/StatsTask')
    const StatesTask = await import('App/Tasks/StatesTask')
    // const CurrentSongTask = await import('App/Tasks/CurrentSongTask')
    // const HistorySongsTask = await import('App/Tasks/HistorySongsTask')

    await StatsTask.ShutDown()
    await StatesTask.ShutDown()
    // await CurrentSongTask.ShutDown()
    // await HistorySongsTask.ShutDown()

    Logger.info('Application is closing. Bye...')
  }
}
