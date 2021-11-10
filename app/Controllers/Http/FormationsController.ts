import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import FormationStoreValidator from 'App/Validators/formation/FormationStoreValidator'
import FormationUpdateValidator from 'App/Validators/formation/FormationUpdateValidator'
import Formation from 'App/Models/Formation'
import { getTranslation } from 'App/Utils/TranslationsUtils'

export default class FormationsController {
  public async index({ response }: HttpContextContract) {
    const formations = await Formation
      .query()
      .orderBy('begin_date', 'desc')
      .preload('title')
      .preload('description')
    return response.status(200).send({
      formations,
    })
  }

  public async store({ request, response }: HttpContextContract) {
    const data = await request.validate(FormationStoreValidator)
    const formation = await Formation.create(data)

    await formation.related('title').associate(await getTranslation(data.title))
    await formation.related('description').associate(await getTranslation(data.description))

    return response.status(200).send({
      formation,
    })
  }

  public async show({ params, response }: HttpContextContract) {
    const formation = await Formation.findOrFail(params.id)
    formation.load('title')
    formation.load('description')
    return response.status(200).send({
      formation,
    })
  }

  public async update({ request, params, response }: HttpContextContract) {
    const data = await request.validate(FormationUpdateValidator)
    const formation = await Formation.findOrFail(params.id)

    if (data.title)
      await formation.related('title').associate(await getTranslation(data.title))

    if (data.description)
      await formation.related('description').associate(await getTranslation(data.description))

    await formation.merge(data).save()

    return response.status(200).send({
      formation,
    })
  }

  public async destroy({ response, params }: HttpContextContract) {
    const formation = await Formation.findOrFail(params.id)
    await formation.delete()
    return response.status(200).send({
      message: 'Formation successfully deleted!',
    })
  }
}
