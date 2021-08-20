import Route from "@ioc:Adonis/Core/Route";

Route.group(() => {
  Route.get('/me', 'AuthController.user').middleware('auth')
  Route.post('/token', 'AuthController.createInfiniteToken')

  Route.post('/login', 'AuthController.login')
  Route.post('/logout', 'AuthController.logout')

  Route.post('/twitter/callback', 'AuthController.twitter')
  Route.post('/github/callback', 'AuthController.github')
  Route.post('/google/callback', 'AuthController.google')
  Route.post('/discord/callback', 'AuthController.discord')

  Route.get('/twitter', async ({ ally }) => {
    return ally.use('twitter').redirect()
  })
  Route.get('/github', async ({ ally }) => {
    return ally.use('github').stateless().redirect()
  })
  Route.get('/google', async ({ ally }) => {
    return ally.use('google').redirect()
  })
  Route.get('/discord', async ({ ally }) => {
    return ally.use('discord').redirect()
  })
}).prefix('/auth')

