import Route from '@ioc:Adonis/Core/Route'
import Application from "@ioc:Adonis/Core/Application";
import {HttpContextContract} from "@ioc:Adonis/Core/HttpContext";
import HealthCheck from "@ioc:Adonis/Core/HealthCheck";

const BASE_URL = "https://api.arthurdanjou.fr"

Route.get('/health', async ({ response }) => {
  const report = await HealthCheck.getReport()
  return report.healthy ? response.ok(report) : response.badRequest(report)
})

Route.get('/', async ({response}: HttpContextContract) => {
  response.status(200).send({
    domain: BASE_URL,
    version: "1.0",
    source: `${BASE_URL}/source`,
    routes: {
      deezer_data: `${BASE_URL}/deezer`,
      stats_data: `${BASE_URL}/stats`,
      state_data: `${BASE_URL}/state`,
      locations_data: `${BASE_URL}/location`,
      locations_history: `${BASE_URL}/location/history`,
      health: `${BASE_URL}/health`
    }
  })
})

/*

TODO

Deezer Songs:

Tasks: kernel : setTimeout or cron
  Deezer songs: 1min
 */

Route.get('/source', async ({response}: HttpContextContract) => {
  return response.redirect('https://github.com/arthurdanjou/artapi')
})
Route.get('/location', 'LocationsController.get')
Route.get('/location/history', 'LocationsController.history')
Route.get('/stats', 'StatsController.get')
Route.get('/state', 'StatesController.get')
Route.resource('users', 'UsersController').only(['index', 'show'])
Route.get('/posts/:slug', 'PostsController.getLikes')
Route.get('/posts/is/:slug', 'PostsController.isLiked')
Route.post('/posts/:slug/like', 'PostsController.like')
Route.post('/posts/:slug/unlike', 'PostsController.unlike')
Route.resource('subscribers', 'SubscribersController').only(['index', 'show'])
Route.resource('files', 'FileController').only(['index'])

Route.get('/files/:filename', async ({ response, params }) => {
  response.download(Application.makePath('storage', params.filename))
})

Route.group(() => {
  Route.resource('users', 'UsersController').only(['store', 'update', 'destroy'])
  Route.resource('posts', 'PostsController').only(['store', 'update', 'destroy'])
  Route.resource('subscribers', 'SubscribersController').only(['store', 'update', 'destroy'])
  Route.resource('files', 'FileController').only(['store', 'destroy'])
  Route.post('/state', 'StatesController.set')
  Route.post('/stats/build', 'StatesController.incrementBuild')
  Route.post('/stats/command', 'StatesController.incrementCommand')
  Route.post('/location', 'StatesController.set')

}).middleware('auth')

Route.group(() => {
  Route.get('/me', 'AuthController.user').middleware('auth')

  Route.post('/web/login', 'AuthController.loginWeb')
  Route.post('/web/logout', 'AuthController.logoutWeb')

  Route.post('/api/login', 'AuthController.loginApi')
  Route.post('/api/logout', 'AuthController.logoutApi')
}).prefix('auth')
