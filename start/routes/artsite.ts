import Route from "@ioc:Adonis/Core/Route";

Route.group(() => {
  Route.resource('/form', 'FormsController').except(['edit', 'create', 'update'])

  Route.resource('/announces', 'AnnouncesController').except(['edit', 'create'])

  Route.resource('/skills', 'SkillsController').except(['edit', 'create'])

  Route.resource('/projects', 'ProjectsController').except(['edit', 'create'])

  Route.resource('/informations', 'InformationsController').only(['index', 'update'])

  Route.group(() => {
    Route.get('/:slug', 'PostsController.getLikes')
    Route.post('/:slug/like', 'PostsController.like')
    Route.post('/:slug/unlike', 'PostsController.unlike')
  }).prefix('/posts')

  Route.resource('/subscribers', 'SubscribersController').only(['index', 'store', 'destroy'])

  Route.resource('/guestbook', 'GuestBookController').except(['edit', 'create', 'destroy'])
  Route.get('/guestbook/:email', 'GuestBookController.exists')

}).middleware('auth')
