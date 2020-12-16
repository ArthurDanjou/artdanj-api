import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Application from "@ioc:Adonis/Core/Application";
import File from "App/Models/File";

export default class FileController {

  public async index () {
    return File.query()
  }

  public async store ({request}: HttpContextContract) {
    const file = await request.file('file', {
      extnames: ['jpg', 'png', 'jpeg']
    })
    const label = request.input('label')

    if (!file) {
      return 'Please upload file'
    }
    if (file.hasErrors) {
      return file.errors
    }

    await file.move(Application.makePath('storage'), {
      name: `${label}.${file.extname}`
    })

    return await File.create({
      fileName: `${label}.${file.extname}`,
      label: label
    })
  }

  public async destroy({ params }: HttpContextContract) {
    const file = await File.findOrFail(params.id)
    await file.delete()
    return { message: "Le fichier a bien été supprimée" }
  }

}
