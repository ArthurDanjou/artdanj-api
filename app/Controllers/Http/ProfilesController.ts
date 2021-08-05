import {HttpContextContract} from "@ioc:Adonis/Core/HttpContext";
import Profile from "App/Models/Profile";
import ProfileUpdateValidator from "App/Validators/profile/ProfileUpdateValidator";

export default class ProfilesController {

  public async index ( { response }: HttpContextContract ) {
    return response.status(200).send({
      profile: await Profile.first()
    })
  }

  public async update ( { response, request }: HttpContextContract ) {
    const profile = await Profile.firstOrFail()
    const data = await request.validate(ProfileUpdateValidator)
    await profile.merge(data).save()

    return response.status(200).send({
      profile
    })
  }

}
