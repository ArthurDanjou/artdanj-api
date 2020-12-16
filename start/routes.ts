import Route from '@ioc:Adonis/Core/Route'
import Application from "@ioc:Adonis/Core/Application";

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
  Route.resource('files', 'FileController').only(['store', 'update', 'destroy'])

}).middleware('auth')

Route.group(() => {
  Route.get('/me', 'AuthController.user').middleware('auth')

  Route.post('/web/login', 'AuthController.loginWeb')
  Route.post('/web/logout', 'AuthController.logoutWeb')

  Route.post('/api/login', 'AuthController.loginApi')
  Route.post('/api/logout', 'AuthController.logoutApi')
}).prefix('auth')
