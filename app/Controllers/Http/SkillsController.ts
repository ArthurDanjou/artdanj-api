import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import File from 'App/Models/File'
import Skill from 'App/Models/Skill'
import SkillStoreValidator from 'App/Validators/skill/SkillStoreValidator'
import SkillUpdateValidator from 'App/Validators/skill/SkillUpdateValidator'

export default class SkillsController {
  public async index({ response }: HttpContextContract) {
    const skills = await Skill
      .query()
      .preload('file')
    return response.status(200).send({
      skills,
    })
  }

  public async store({ request, response }: HttpContextContract) {
    const data = await request.validate(SkillStoreValidator)
    const skill = await Skill.create(data)

    const cover = await File.findBy('label', data.cover)
    if (cover)
      await skill.related('file').associate(cover)

    return response.status(200).send({
      skill,
    })
  }

  public async show({ params, response }: HttpContextContract) {
    const skill = await Skill.findOrFail(params.id)
    skill.load('file')
    return response.status(200).send({
      skill,
    })
  }

  public async update({ request, params, response }: HttpContextContract) {
    const data = await request.validate(SkillUpdateValidator)
    const skill = await Skill.findOrFail(params.id)

    const cover = await File.findBy('label', data.cover)
    if (cover)
      await skill.related('file').associate(cover)
    await skill.merge(data).save()

    return response.status(200).send({
      skill,
    })
  }

  public async destroy({ response, params }: HttpContextContract) {
    const skill = await Skill.findOrFail(params.id)
    await skill.delete()
    return response.status(200).send({
      message: 'Skill successfully deleted!',
    })
  }
}
