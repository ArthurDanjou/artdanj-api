import Post from "App/Models/Post";
import {HttpContextContract} from "@ioc:Adonis/Core/HttpContext";
import PostUpdateValidator from "App/Validators/post/PostUpdateValidator";
import getTranslation from "App/Utils/getTranslation";
import File from "App/Models/File";
import PostStoreValidator from "App/Validators/post/PostStoreValidator";

export default class PostsController {

  public async index ({ response }: HttpContextContract) {
    return response.status(200).send({
      posts: await Post.query()
        .preload('tags', (tags) => {
          tags.preload('label')
        })
        .preload('cover')
        .preload('title')
        .preload('description')
    })
  }

  public async store ({ request, response }: HttpContextContract) {
    const data = await request.validate(PostStoreValidator)
    const post = await Post.create(data)
    const cover = await File.findByOrFail('label', data.cover)

    await post.related('cover').associate(cover)
    await post.related('description').associate(await getTranslation(data.description))
    await post.related('title').associate(await getTranslation(data.title))
    await post.related('tags').sync(data.tags!)
    return response.status(200).send({
      post
    })
  }

  public async show ({ params, response }: HttpContextContract) {
    const post = await Post.findOrFail(params.id)
    await post.load('cover')
    await post.load('title')
    await post.load('description')
    await post.load('tags', (tags) => {
      tags.preload('label')
    })
    return response.status(200).send({
      post
    })
  }

  public async get ({ params, response }: HttpContextContract) {
    const post = await Post.firstOrCreate({
      slug: params.slug
    }, {
      slug: params.slug,
      likes: 0
    })
    await post.load('tags', (tags) => {
      tags.preload('label')
    })
    await post.load('cover')
    await post.load('description')
    await post.load('title')
    return response.status(200).send({
      post
    })
  }

  public async update ({ request, params, response }: HttpContextContract) {
    const post = await Post.findOrFail(params.id)
    const data = await request.validate(PostUpdateValidator)

    await post.merge(data).save()
    await post.related('tags').sync(data.tags!)
    await post.related('description').associate(await getTranslation(data.description!))
    await post.related('title').associate(await getTranslation(data.title!))

    const cover = await File.findBy('label', data.cover)
    if (cover) await post.related('cover').associate(cover)
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
