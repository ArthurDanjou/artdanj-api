import Route from "@ioc:Adonis/Core/Route";

Route.group(() => {
  Route.get('/me', 'AuthController.user').middleware('auth')
  Route.post('/token', 'AuthController.createInfiniteToken')

  Route.post('/login', 'AuthController.login')
  Route.post('/logout', 'AuthController.logout')
}).prefix('/auth')

