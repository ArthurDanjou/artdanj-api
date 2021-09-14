import Route from "@ioc:Adonis/Core/Route";

Route.group(() => {
  Route.get('/me', 'AuthController.user')
  Route.post('/token', 'AuthController.createInfiniteToken')

  Route.group(() => {
    Route.post('/login', 'AuthController.loginApi')
    Route.post('/logout', 'AuthController.logoutApi')
  }).prefix('/api')

  Route.group(() => {
    Route.post('/login', 'AuthController.loginWeb')
    Route.post('/logout', 'AuthController.logoutWeb')
  }).prefix('/web')

}).prefix('/auth')

