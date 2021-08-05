import Route from "@ioc:Adonis/Core/Route";
import Application from "@ioc:Adonis/Core/Application";

Route.group(() => {
  Route.get('/discord', 'ProfileController.discord')
  Route.get('/me', 'ProfileController.me')

  Route.resource('/users', 'UsersController').except(['edit', 'create'])

  Route.resource('/translations', 'TranslationsController').except(['edit', 'create'])

  Route.resource('/locations', 'LocationsController').only(['index', 'store'])

  Route.resource('/files', 'FileController').only(['index', 'store', 'destroy'])

  Route.group(() => {
    Route.get('/', 'FileController.index')
    Route.get('/:filename', async ({response, params}) => {
      response.download(Application.makePath('storage', params.filename))
    })
  }).prefix('/files')

}).middleware('auth')
