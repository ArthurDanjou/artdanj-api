import Route from "@ioc:Adonis/Core/Route";

Route.group(() => {
  Route.post('/form', 'FormsController.send')
  Route.group(() => {
    Route.get('/:slug', 'PostsController.getLikes')
    Route.post('/:slug/like', 'PostsController.like')
    Route.post('/:slug/unlike', 'PostsController.unlike')
  }).prefix('/posts')
  Route.get('/subscribers', 'SubscribersController.get')
  Route.post('/subscribers', 'SubscribersController.store')
  Route.delete('/subscribers', 'SubscribersController.delete')
  Route.get('/guestbook', 'GuestBookController.get')
  Route.post('/guestbook', 'GuestBookController.store')
}).middleware('auth')
