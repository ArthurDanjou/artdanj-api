import Route from "@ioc:Adonis/Core/Route";
import Application from "@ioc:Adonis/Core/Application";

Route.group(() => {
  Route.get('/discord', 'ProfileController.discord')
  Route.post('/states/:state', 'StatesController.set')
  Route.resource('/users', 'UsersController')
  Route.post('/locations', 'LocationsController.store')
  Route.post('/projects', 'ProjectsController.store')
  Route.resource('/files', 'FileController').only(['store', 'destroy'])
  Route.group(() => {
    Route.get('/', 'FileController.index')
    Route.get('/:filename', async ({response, params}) => {
      response.download(Application.makePath('storage', params.filename))
    })
  }).prefix('/files')
}).middleware('auth')
