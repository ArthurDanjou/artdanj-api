import {HttpContextContract} from '@ioc:Adonis/Core/HttpContext'
import Application from "@ioc:Adonis/Core/Application";
import File from "App/Models/File";

export default class FileController {

  public async index({response}: HttpContextContract) {
    return response.status(200).send({
      files: File.query()
    })
  }

  public async store({request, response}: HttpContextContract) {
    const file = await request.file('file', {
      extnames: ['jpg', 'png', 'jpeg']
    })
    const label = request.input('label')

    if (!file) {
      return 'Please upload file!'
    }
    if (file.hasErrors) {
      return file.errors
    }

    await file.move(Application.makePath('storage'), {
      name: `${label}.${file.extname}`
    })

    return response.status(200).send({
      file: await File.create({
        fileName: `${label}.${file.extname}`,
        label: label
      })
    })
  }

  public async destroy({params, response}: HttpContextContract) {
    const file = await File.findOrFail(params.id)
    await file.delete()
    return response.status(200).send({
      message: 'File successfully deleted!'
    })
  }

}
