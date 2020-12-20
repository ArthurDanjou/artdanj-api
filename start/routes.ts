import Route from '@ioc:Adonis/Core/Route'
import Application from "@ioc:Adonis/Core/Application";
import {HttpContextContract} from "@ioc:Adonis/Core/HttpContext";
import HealthCheck from "@ioc:Adonis/Core/HealthCheck";

const BASE_URL = "https://api.arthurdanjou.fr"

Route.get('/', async ({response}: HttpContextContract) => {
  return response.status(200).send({
    domain: BASE_URL,
    version: "1.0",
    source: `${BASE_URL}/source`,
    healthCheck: `${BASE_URL}/health`,
    routes: {
      arthur_data: `${BASE_URL}/me`,
      stats_data: `${BASE_URL}/stats`,
      states_data: `${BASE_URL}/states`,
      locations_data: `${BASE_URL}/locations`,
      locations_history: `${BASE_URL}/locations/history`,
      projects: `${BASE_URL}/projects`
    },

  })
})

Route.get('/source', async ({response}: HttpContextContract) => {
  return response.redirect('https://github.com/arthurdanjou/artapi')
})

Route.get('health', async ({response}: HttpContextContract) => {
  const report = await HealthCheck.getReport()
  return report.healthy ? response.ok(report) : response.badRequest(report)
})

Route.get('/me', 'MeController.me')
Route.get('/locations', 'LocationsController.get')
Route.get('/locations/history', 'LocationsController.history')
Route.get('/stats', 'StatsController.get')
Route.get('/states', 'StatesController.get')
Route.get('/projects', 'ProjectsController.get')
Route.resource('users', 'UsersController').only(['index', 'show'])
Route.get('/posts/:slug', 'PostsController.getLikes')
Route.get('/posts/is/:slug', 'PostsController.isLiked')
Route.post('/posts/:slug/like', 'PostsController.like')
Route.post('/posts/:slug/unlike', 'PostsController.unlike')
Route.resource('subscribers', 'SubscribersController').only(['index', 'show'])

Route.group(() => {
  Route.get('/', 'FileController.index')
  Route.get('/:filename', async ({ response, params }) => {
    response.download(Application.makePath('storage', params.filename))
  })
}).prefix('/files')

Route.group(() => {
  Route.resource('users', 'UsersController').only(['store', 'update', 'destroy'])
  Route.resource('posts', 'PostsController').only(['store', 'update', 'destroy'])
  Route.resource('subscribers', 'SubscribersController').only(['store', 'update', 'destroy'])
  Route.resource('files', 'FileController').only(['store', 'destroy'])
  Route.post('/states/sleeping', 'StatesController.setSleepingStatus')
  Route.post('/states/learning', 'StatesController.setLearningStatus')
  Route.post('/states/developing', 'StatesController.setDevelopingStatus')
  Route.post('/states/music', 'StatesController.setListeningStatus')
  Route.post('/stats/build', 'StatesController.incrementBuild')
  Route.post('/stats/command', 'StatesController.incrementCommand')
  Route.post('/locations', 'LocationsController.add')
  Route.post('/projects', 'ProjectsController.add')
}).middleware('auth')

Route.group(() => {
  Route.get('/me', 'AuthController.user').middleware('auth')

  Route.post('/web/login', 'AuthController.loginWeb')
  Route.post('/web/logout', 'AuthController.logoutWeb')

  Route.post('/api/login', 'AuthController.loginApi')
  Route.post('/api/logout', 'AuthController.logoutApi')
}).prefix('auth')
