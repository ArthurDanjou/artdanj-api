import Route from '@ioc:Adonis/Core/Route'
import Application from "@ioc:Adonis/Core/Application";
import {HttpContextContract} from "@ioc:Adonis/Core/HttpContext";
import HealthCheck from "@ioc:Adonis/Core/HealthCheck";

const BASE_URL = "https://api.arthurdanjou.fr"

Route.get('/', async ({response}: HttpContextContract) => {
  return response.status(200).send({
    domain: BASE_URL,
    version: "2.0",
    source: `${BASE_URL}/source`,
    healthCheck: `${BASE_URL}/health`,
    routes: {
      profile: `${BASE_URL}/profile`,
      stats: `${BASE_URL}/stats`,
      states: `${BASE_URL}/states`,
      locations: `${BASE_URL}/locations`,
      projects: `${BASE_URL}/projects`
    }
  })
})

Route.get('/source', async ({response}: HttpContextContract) => {
  return response.redirect('https://github.com/arthurdanjou/artapi')
})

Route.get('health', async ({response}: HttpContextContract) => {
  const report = await HealthCheck.getReport()
  const isLive = await HealthCheck.isLive()
  const isReady = await HealthCheck.isReady()
  return report.healthy ? response.ok({ isLive, isReady, report: report.report }) : response.badRequest({ isLive, isReady, report: report.report })
})

// ArtAPI
Route.get('/profile', 'ProfileController.me')
Route.get('/locations', 'LocationsController.get')
Route.get('/stats', 'StatsController.get')
Route.get('/states', 'StatesController.get')
Route.get('/projects', 'ProjectsController.get')

Route.resource('users', 'UsersController').only(['index', 'show'])
Route.group(() => {
  Route.get('/', 'FileController.index')
  Route.get('/:filename', async ({ response, params }) => {
    response.download(Application.makePath('storage', params.filename))
  })
}).prefix('/files')

Route.group(() => {
  Route.resource('users', 'UsersController').only(['store', 'update', 'destroy'])
  Route.resource('files', 'FileController').only(['store', 'destroy'])
  Route.post('/locations', 'LocationsController.add')
  Route.post('/projects', 'ProjectsController.add')
}).middleware('auth:web')

Route.group(() => {
  // ArtAPI
  Route.post('form', 'FormsController.send')
  Route.post('/states/:state', 'StatesController.set')
  Route.post('/stats/build', 'StatesController.incrementBuild')
  Route.post('/stats/command', 'StatesController.incrementCommand')
  // ArtSite
  Route.group(() => {
    Route.get('/:slug', 'PostsController.getLikes')
    Route.post('/:slug/like', 'PostsController.like')
    Route.post('/:slug/unlike', 'PostsController.unlike')
  }).prefix('posts')
}).middleware('auth:api')

Route.group(() => {
  Route.get('/me', 'AuthController.user').middleware('auth')

  Route.post('/web/login', 'AuthController.loginWeb')
  Route.post('/web/logout', 'AuthController.logoutWeb')

  Route.post('/api/login', 'AuthController.loginApi')
  Route.post('/api/logout', 'AuthController.logoutApi')
}).prefix('auth')
