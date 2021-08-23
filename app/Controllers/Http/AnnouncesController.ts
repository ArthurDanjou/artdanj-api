import {HttpContextContract} from "@ioc:Adonis/Core/HttpContext";
import Announce from "App/Models/Announce";
import AnnounceUpdateValidator from "App/Validators/announce/AnnounceUpdateValidator";
import getTranslation from "App/Utils/getTranslation";
import File from "App/Models/File";

export default class AnnouncesController {

  public async index ({ response }: HttpContextContract) {
    const announce = await Announce
      .query()
      .orderBy('created_at', 'desc')
      .preload('message')
      .preload('cover')
      .first()
    return response.status(200).send({
      announce: announce
    })
  }

  public async update ({ request, params, response }: HttpContextContract) {
    const data = await request.validate(AnnounceUpdateValidator)
    const announce = await Announce.findOrFail(params.id)

    if (data.code) {
      await announce.related('message').associate(await getTranslation(data.code))
    }

    const cover = await File.findBy('label', data.cover)
    if (cover) await announce.related('cover').associate(cover)

    await announce.merge(data).save()

    return response.status(200).send({
      announce
    })
  }

}
