import Post from "App/Models/Post";
import {HttpContextContract} from "@ioc:Adonis/Core/HttpContext";
import Redis from "@ioc:Adonis/Addons/Redis";

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

  public async unlike ({request, params}: HttpContextContract) {
    const post = await Post.findByOrFail('slug', params.slug)
    const ip = await request.ip()

    const getLikes = post.likes - 1
    const isLiked = await Redis.exists(`posts:${post.slug}/${ip}`)

    if (isLiked) {
      await Redis.del(`posts:${post.slug}/${ip}`)
      await post.merge({
        likes: getLikes
      }).save()
      return {
        code: 200,
        post
      }
    }
  }

  public async isLiked ({params, request}: HttpContextContract) {
    const post = await Post.findBy('slug', params.slug)
    if (post) {
      const ip = request.ip()
      return Redis.exists(`posts:${post.slug}/${ip}`);
    }
    return false
  }

  public async like ({request, params}: HttpContextContract) {
    let post = await Post.findBy('slug', params.slug)
    const ip = await request.ip()

    if (!post) {
      post = await Post.create({
        slug: params.slug,
        likes: 0
      })
    }

    const getLikes = post.likes + 1
    const isLiked = await Redis.exists(`posts:${post.slug}/${ip}`)

    if (!isLiked) {
      await Redis.set(`posts:${post.slug}/${ip}`, Date.now())
      await post.merge({
        likes: getLikes
      }).save()
      return {
        code: 200,
        post
      }
    }
  }

}
