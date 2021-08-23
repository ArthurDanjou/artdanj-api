import Post from "App/Models/Post";
import {HttpContextContract} from "@ioc:Adonis/Core/HttpContext";
import PostUpdateValidator from "App/Validators/post/PostUpdateValidator";

export default class PostsController {

  public async index ({ response }: HttpContextContract) {
    return response.status(200).send({
      posts: await Post.query()
        .preload('tags', (tags) => {
          tags.preload('label')
        })
    })
  }

  public async show ({ params, response }: HttpContextContract) {
    const post = await Post.firstOrCreate({
      slug: params.slug
    }, {
      slug: params.slug,
      likes: 0
    })
    await post.load('tags', (tags) => {
      tags.preload('label')
    })
    return response.status(200).send({
      post
    })
  }

  public async update ({ request, params, response }: HttpContextContract) {
    const post = await Post.findOrFail(params.id)
    const data = await request.validate(PostUpdateValidator)

    await post.merge(data).save()
    await post.related('tags').sync(data.tags!)
    return response.status(200).send({
      post
    })
  }

  public async destroy ({ response, params }: HttpContextContract) {
    const post = await Post.findOrFail(params.id)
    await post.delete()
    return response.status(200).send({
      message: 'Post successfully deleted!'
    })
  }

  public async like ({ params, response }: HttpContextContract) {
    const post = await Post.firstOrCreate({
      slug: params.slug
    }, {
      slug: params.slug,
      likes: 0
    })
    post.likes = post.likes++
    await post.save()
    return response.status(200).send({
      post
    })
  }

  public async unlike ({ params, response }: HttpContextContract) {
    const post = await Post.findByOrFail('slug', params.slug)
    post.likes = post.likes--
    await post.save()
    return response.status(200).send({
      post
    })
  }

}
