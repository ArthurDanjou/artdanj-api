import Post from "App/Models/Post";
import {HttpContextContract} from "@ioc:Adonis/Core/HttpContext";

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
    const post = await Post.findByOrFail('slug', params.slug)
    await post.load('tags', (tags) => {
      tags.preload('label')
    })
    return response.status(200).send({
      post
    })
  }

  public async getLikes ({ params, response }: HttpContextContract) {
    const post = await Post.firstOrCreate({
      slug: params.slug
    }, {
      slug: params.slug,
      likes: 0
    })

    return response.status(200).send({
      likes: post.likes
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
