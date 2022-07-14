import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Translation from 'App/Models/Translation'
import TranslationStoreValidator from 'App/Validators/translation/TranslationStoreValidator'
import TranslationUpdateValidator from 'App/Validators/translation/TranslationUpdateValidator'

export default class TranslationsController {
  public async index({ response }: HttpContextContract) {
    return response.status(200).send({
      translations: await Translation.query().orderBy('id', 'asc'),
    })
  }

  public async store({ request, response }: HttpContextContract) {
    const data = await request.validate(TranslationStoreValidator)
    return response.status(200).send({
      translation: await Translation.create(data),
    })
  }

  public async show({ params, response }: HttpContextContract) {
    return response.status(200).send({
      translation: await Translation.findOrFail(params.id),
    })
  }

  public async update({ request, params, response }: HttpContextContract) {
    const translation = await Translation.findOrFail(params.id)
    const data = await request.validate(TranslationUpdateValidator)
    await translation.merge(data).save()

    return response.status(200).send({
      translation,
    })
  }

  public async destroy({ response, params }: HttpContextContract) {
    const translation = await Translation.findOrFail(params.id)
    await translation.delete()
    return response.status(200).send({
      message: 'Translation successfully deleted!',
    })
  }
}
