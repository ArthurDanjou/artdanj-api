import {HttpContextContract} from '@ioc:Adonis/Core/HttpContext'
import Project from "App/Models/Project";
import ProjectStoreValidator from "App/Validators/project/ProjectStoreValidator";
import ProjectUpdateValidator from "App/Validators/project/ProjectUpdateValidator";
import File from "App/Models/File";

export default class ProjectsController {

  public async index ({ response }: HttpContextContract) {
    return response.status(200).send({
      projects: await Project.query()
        .orderBy('id', 'asc')
        .preload('file')
    })
  }

  public async store ({ request, response }: HttpContextContract) {
    const data = await request.validate(ProjectStoreValidator)
    const project = await Project.create(data)
    const cover = await File.findByOrFail('label', data.cover)

    await project.related('file').associate(cover)
    return response.status(200).send({
      project
    })
  }

  public async show ({ params, response }: HttpContextContract) {
    const project = await Project.findOrFail(params.id)
    await project.load('file')
    return response.status(200).send({
      project
    })
  }

  public async update ({ request, params, response }: HttpContextContract) {
    const project = await Project.findOrFail(params.id)
    const data = await request.validate(ProjectUpdateValidator)
    const cover = await File.findBy('label', data.cover)

    await project.merge(data).save()
    if (cover) await project.related('file').associate(cover)
    return response.status(200).send({
      project
    })
  }

  public async destroy ({ response, params }: HttpContextContract) {
    const project = await Project.findOrFail(params.id)
    await project.delete()
    return response.status(200).send({
      message: 'Project successfully deleted!'
    })
  }

}
