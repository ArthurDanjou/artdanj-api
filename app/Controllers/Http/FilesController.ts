import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Application from '@ioc:Adonis/Core/Application'
import File from 'App/Models/File'

export default class FilesController {
  public async index({ response }: HttpContextContract) {
    return response.status(200).send({
      files: await File.all(),
    })
  }

  public async store({ request, response }: HttpContextContract) {
    const file = await request.file('file', {
      extnames: ['jpg', 'png', 'jpeg'],
    })
    const label = request.input('label')

    if (!file)
      return 'Please upload file!'

    if (file.hasErrors)
      return file.errors

    await file.move(Application.makePath('storage'), {
      name: `${label}.${file.extname}`,
      overwrite: true,
    })

    return response.status(200).send({
      file: await File.firstOrCreate({
        label,
      }, {
        fileName: `${label}.${file.extname}`,
        label,
      }),
    })
  }

  public async destroy({ params, response }: HttpContextContract) {
    const file = await File.findOrFail(params.id)
    await file.delete()
    return response.status(200).send({
      message: 'File successfully deleted!',
    })
  }
}
