import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Experience from 'App/Models/Experience'
import ExperienceStoreValidator from 'App/Validators/experience/ExperienceStoreValidator'
import ExperienceUpdateValidator from 'App/Validators/experience/ExperienceUpdateValidator'
import { getTranslation } from 'App/Utils/TranslationsUtils'

export default class ExperiencesController {
  public async index({ response }: HttpContextContract) {
    const experiences = await Experience
      .query()
      .orderBy('begin_date', 'desc')
      .preload('title')
    return response.status(200).send({
      experiences,
    })
  }

  public async store({ request, response }: HttpContextContract) {
    const data = await request.validate(ExperienceStoreValidator)
    const experience = await Experience.create(data)
    await experience.related('title').associate(await getTranslation(data.title))

    return response.status(200).send({
      experience,
    })
  }

  public async show({ params, response }: HttpContextContract) {
    const experience = await Experience.findOrFail(params.id)
    experience.load('title')
    return response.status(200).send({
      experience,
    })
  }

  public async update({ request, params, response }: HttpContextContract) {
    const data = await request.validate(ExperienceUpdateValidator)
    const experience = await Experience.findOrFail(params.id)

    if (data.title)
      await experience.related('title').associate(await getTranslation(data.title))

    await experience.merge(data).save()

    return response.status(200).send({
      experience,
    })
  }

  public async destroy({ response, params }: HttpContextContract) {
    const experience = await Experience.findOrFail(params.id)
    await experience.delete()
    return response.status(200).send({
      message: 'Experience successfully deleted!',
    })
  }
}
