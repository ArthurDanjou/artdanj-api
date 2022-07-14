import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import PostColor from 'App/Models/PostColor'
import PostColorStoreValidator from 'App/Validators/postColor/PostColorStoreValidator'
import PostColorUpdateValidator from 'App/Validators/postColor/PostColorUpdateValidator'

export default class PostColorsController {
  public async index({ response }: HttpContextContract) {
    return response.status(200).send({
      post_colors: await PostColor.all(),
    })
  }

  public async store({ request, response }: HttpContextContract) {
    const data = await request.validate(PostColorStoreValidator)
    const postColor = await PostColor.create(data)
    return response.status(200).send({
      post_color: postColor,
    })
  }

  public async show({ params, response }: HttpContextContract) {
    const postColor = await PostColor.findOrFail(params.id)
    return response.status(200).send({
      post_color: postColor,
    })
  }

  public async update({ request, params, response }: HttpContextContract) {
    const data = await request.validate(PostColorUpdateValidator)
    const postColor = await PostColor.findOrFail(params.id)
    await postColor.merge(data).save()
    return response.status(200).send({
      post_color: postColor,
    })
  }

  public async destroy({ response, params }: HttpContextContract) {
    const postColor = await PostColor.findOrFail(params.id)
    await postColor.delete()
    return response.status(200).send({
      message: 'PostColor successfully deleted!',
    })
  }
}
