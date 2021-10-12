import { ApplicationContract } from '@ioc:Adonis/Core/Application'
import Logger from "@ioc:Adonis/Core/Logger";

export default class AppProvider {
	public static needsApplication = true

  constructor (protected app: ApplicationContract) {
  }

  public register () {
    // Register your own bindings
  }

  public async boot () {
    // IoC container is ready
    Logger.info('Application is booting. Please wait...')
  }

  public async ready () {
    // App is ready
    const StatsTask = await import('App/Tasks/StatsTask')
    await StatsTask.Activate()
    Logger.info('Application is ready!')
  }

  public async shutdown () {
    // Cleanup, since app is going down
    const StatsTask = (await import('App/Tasks/StatsTask'))
    await StatsTask.ShutDown()
    Logger.info('Application is closing. Bye...')
  }
}
