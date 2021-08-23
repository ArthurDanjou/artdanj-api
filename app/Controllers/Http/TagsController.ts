import {HttpContextContract} from "@ioc:Adonis/Core/HttpContext";
import getTranslation from "App/Utils/getTranslation";
import TagStoreValidator from "App/Validators/tag/TagStoreValidator";
import TagUpdateValidator from "App/Validators/tag/TagUpdateValidator";
import Tag from "App/Models/Tag";

export default class TagsController {

  public async index ({ response }: HttpContextContract) {
    const tags = await Tag
      .query()
      .preload('label')
    return response.status(200).send({
      tags: tags
    })
  }

  public async store ({ request, response }: HttpContextContract) {
    const data = await request.validate(TagStoreValidator)
    const tag = await Tag.create({})

    await tag.related('label').associate(await getTranslation(data.label))

    return response.status(200).send({
      tag: tag
    })
  }

  public async show ({ params, response }: HttpContextContract) {
    const tag = await Tag.findOrFail(params.id)
    tag.load('label')
    return response.status(200).send({
      tag
    })
  }

  public async update ({ request, params, response }: HttpContextContract) {
    const data = await request.validate(TagUpdateValidator)
    const tag = await Tag.findOrFail(params.id)

    if (data.label) {
      await tag.related('label').associate(await getTranslation(data.label))
    }

    return response.status(200).send({
      tag
    })
  }

  public async destroy ({ response, params }: HttpContextContract) {
    const tag = await Tag.findOrFail(params.id)
    await tag.delete()
    return response.status(200).send({
      message: 'Tag successfully deleted!'
    })
  }

}
