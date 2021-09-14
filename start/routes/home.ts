import Env from "@ioc:Adonis/Core/Env";
import Route from "@ioc:Adonis/Core/Route";
import {HttpContextContract} from "@ioc:Adonis/Core/HttpContext";
import HealthCheck from "@ioc:Adonis/Core/HealthCheck";

const BASE_URL = Env.get('BASE_URL')

Route.get('/', async ({response}: HttpContextContract) => {
  return response.status(200).send({
    domain: BASE_URL,
    version: Env.get('API_VERSION'),
    source: `${BASE_URL}/source`,
    healthCheck: `${BASE_URL}/health`,
    routes: {
      profile: `${BASE_URL}/me`,
      stats: `${BASE_URL}/stats`,
      locations: `${BASE_URL}/locations`
    }
  })
})

Route.get('/source', async ({response}: HttpContextContract) => {
  return response.redirect(Env.get('GITHUB_SOURCE'))
})

Route.get('/health', async ({response}: HttpContextContract) => {
  const report = await HealthCheck.getReport()
  const isLive = await HealthCheck.isLive()
  const isReady = HealthCheck.isReady()
  return report.healthy ? response.ok({isLive, isReady, report: report.report}) : response.badRequest({
    isLive,
    isReady,
    report: report.report
  })
})
