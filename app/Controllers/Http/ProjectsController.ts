import {HttpContextContract} from '@ioc:Adonis/Core/HttpContext'
import Project from "App/Models/Project";
import ProjectValidator from "App/Validators/project/ProjectValidator";

export default class ProjectsController {

  public async get ({ response }: HttpContextContract) {
    return response.status(200).send({
      projects: await Project.query().orderBy('id', 'asc')
    })
  }

  public async store ({ request, response}: HttpContextContract) {
    const data = await request.validate(ProjectValidator)
    await Project.create(data)
    return response.status(200).send({
      message: 'Project successfully created'
    })
  }

}
