import Route from "@ioc:Adonis/Core/Route";

Route.group(() => {
  Route.get('/me', 'AuthController.user').middleware('auth')
  Route.post('/token', 'AuthController.createInfiniteToken')

  Route.post('/login', 'AuthController.login')
  Route.post('/logout', 'AuthController.logout')

  Route.get('/twitter/callback', 'AuthController.twitter')
  Route.get('/github/callback', 'AuthController.github')
  Route.get('/google/callback', 'AuthController.google')
  Route.get('/discord/callback', 'AuthController.discord')

  Route.get('/twitter', async ({ally}) => {
    return ally.use('twitter').stateless().redirect()
  })
  Route.get('/github', async ({ally}) => {
    return ally.use('github').stateless().redirect()
  })
  Route.get('/google', async ({ally}) => {
    return ally.use('google').stateless().redirect()
  })
  Route.get('/discord', async ({ally}) => {
    return ally.use('discord').stateless().redirect()
  })
}).prefix('/auth')

