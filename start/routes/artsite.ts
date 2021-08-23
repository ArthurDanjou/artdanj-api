import Route from "@ioc:Adonis/Core/Route";

Route.group(() => {
  Route.resource('/form', 'FormsController').except(['edit', 'create', 'update'])

  Route.resource('/announce', 'AnnouncesController').only(['index', 'update'])

  Route.resource('/maintenance', 'MaintenancesController').only(['index', 'update'])

  Route.resource('/experiences', 'ExperiencesController').except(['edit', 'create'])

  Route.resource('/formations', 'FormationsController').except(['edit', 'create'])

  Route.resource('/tags', 'TagsController').except(['edit', 'create'])

  Route.resource('/skills', 'SkillsController').except(['edit', 'create'])

  Route.resource('/projects', 'ProjectsController').except(['edit', 'create'])

  Route.resource('/informations', 'InformationsController').only(['index', 'update'])

  Route.group(() => {
    Route.resource('/', 'PostsController').only(['index', 'show', 'destroy'])
    Route.post('/:slug/like', 'PostsController.like')
    Route.post('/:slug/unlike', 'PostsController.unlike')
  }).prefix('/posts')

  Route.resource('/subscribers', 'SubscribersController').only(['index', 'store', 'destroy'])
}).middleware('auth')
