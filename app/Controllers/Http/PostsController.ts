import Post from "App/Models/Post";
import {HttpContextContract} from "@ioc:Adonis/Core/HttpContext";

export default class PostsController {

  public async getLikes ({params}: HttpContextContract) {
    let post = await Post.findBy('slug', params.slug)

    if (!post) {
      post = await Post.create({
        slug: params.slug,
        likes: 0
      })
    }

    return post.likes
  }

  public async like ({params, response}: HttpContextContract) {
    let post = await Post.findBy('slug', params.slug)

    if (!post) {
      post = await Post.create({
        slug: params.slug,
        likes: 0
      })
    }

    const getLikes = post.likes + 1

    await post.merge({
      likes: getLikes
    }).save()
    return response.status(200).send({
      status: 200,
      post
    })
  }

}
