import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import FormStoreValidator from 'App/Validators/form/FormStoreValidator'
import Form from 'App/Models/Form'

export default class FormsController {
  public async index({ response }: HttpContextContract) {
    return response.status(200).send({
      forms: Form.query().orderBy('created_at', 'asc'),
    })
  }

  public async store({ request, response }: HttpContextContract) {
    const data = await request.validate(FormStoreValidator)
    // todo send confirmation email + email to me with FormConfirmation
    return response.status(200).send({
      form: await Form.create(data),
    })
  }

  public async show({ params, response }: HttpContextContract) {
    return response.status(200).send({
      form: await Form.findOrFail(params.id),
    })
  }

  public async destroy({ response, params }: HttpContextContract) {
    const form = await Form.findOrFail(params.id)
    await form.delete()
    return response.status(200).send({
      message: 'Form successfully deleted!',
    })
  }
}
