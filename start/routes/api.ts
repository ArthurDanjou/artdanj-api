import Route from "@ioc:Adonis/Core/Route";
import Application from "@ioc:Adonis/Core/Application";

Route.get('/discord', 'ProfileController.discord')
Route.get('/me', 'ProfileController.me')
Route.get('/stats', 'StatsController.index')
Route.resource('/locations', 'LocationsController').only(['index', 'store'])

Route.group(() => {
  Route.resource('/users', 'UsersController').except(['edit', 'create'])

  Route.resource('/translations', 'TranslationsController').except(['edit', 'create'])

  Route.resource('/files', 'FilesController').only(['index', 'store', 'destroy'])

}).middleware('auth')

Route.get('/files/:filename', async ({response, params}) => {
  response.download(Application.makePath('storage', params.filename))
})
