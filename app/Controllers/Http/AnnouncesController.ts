import {HttpContextContract} from "@ioc:Adonis/Core/HttpContext";
import Announce from "App/Models/Announce";
import AnnounceStoreValidator from "App/Validators/announce/AnnounceStoreValidator";
import AnnounceUpdateValidator from "App/Validators/announce/AnnounceUpdateValidator";
import getTranslation from "App/Tasks/getTranslation";
import File from "App/Models/File";

export default class AnnouncesController {

  public async index ({ response }: HttpContextContract) {
    const announce = await Announce.query().orderBy('created_at', 'desc').first()
    return response.status(200).send({
      announce: announce
    })
  }

  public async store ({ request, response }: HttpContextContract) {
    const data = await request.validate(AnnounceStoreValidator)
    const announce = await Announce.create(data)

    const translation = await getTranslation(data.code)
    await announce.related('message').associate(translation)

    const cover = await File.findBy('label', data.cover)
    if (cover) await announce.related('cover').save(cover)

    return response.status(200).send({
      announce: announce
    })
  }

  public async show ({ params, response }: HttpContextContract) {
    return response.status(200).send({
      user: await Announce.findOrFail(params.id)
    })
  }

  public async update({ request, params, response }: HttpContextContract) {
    const data = await request.validate(AnnounceUpdateValidator)
    const announce = await Announce.findOrFail(params.id)

    if (data.code) {
      const translation = await getTranslation(data.code)
      await announce.related('message').associate(translation)
    }

    const cover = await File.findBy('label', data.cover)
    if (cover) await announce.related('cover').save(cover)

    return response.status(200).send({
      announce
    })
  }

  public async destroy ({ response, params }: HttpContextContract) {
    const announce = await Announce.findOrFail(params.id)
    await announce.delete()
    return response.status(200).send({
      message: 'Announce successfully deleted!'
    })
  }

}
