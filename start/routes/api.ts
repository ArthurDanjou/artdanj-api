import Route from "@ioc:Adonis/Core/Route";
import Application from "@ioc:Adonis/Core/Application";

Route.get('/me', 'ProfileController.me')
Route.get('/stats', 'StatsController.index')
Route.get('/states', 'StatesController.index')
Route.resource('/locations', 'LocationsController').only(['index', 'store'])

Route.group(() => {
  Route.resource('/users', 'UsersController').except(['edit', 'create'])

  Route.resource('/translations', 'TranslationsController').except(['edit', 'create'])

  Route.resource('/files', 'FilesController').only(['index', 'store', 'destroy'])

  Route.group(() => {
    Route.post('/sleeping', 'StatesController.setSleeping')
  }).prefix('states')

  Route.group(() => {
    Route.post('/commands', 'StatsController.incrementCommandCount')
    Route.post('/builds', 'StatsController.incrementBuildCount')
  }).prefix('stats')

}).middleware('auth:web,api')

Route.get('/files/:filename', async ({response, params}) => {
  response.download(Application.makePath('storage', params.filename))
})
