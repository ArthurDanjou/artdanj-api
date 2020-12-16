import {HttpContextContract} from '@ioc:Adonis/Core/HttpContext'
import User from "App/Models/User";
import StoreValidator from "App/Validators/users/StoreValidator";
import UpdateValidator from "App/Validators/users/UpdateValidator";

export default class UsersController {

  public async index () {
    return User.query()
  }

  public async store ({request}: HttpContextContract) {
    const data = await request.validate(StoreValidator)
    return await User.create(data)
  }

  public async show ({params}: HttpContextContract) {
    return await User.findOrFail(params.id)
  }

  public async update({ request, params, response }: HttpContextContract) {
    const user = await User.findOrFail(params.id)
    const data = await request.validate(UpdateValidator)
    const { email } = data
    const user2 = await User.findBy('email', email)

    if (user2 !== null && user.email !== email) {
      return response.abort({
        message: 'L\' adresse mail n\'est pas unique !'
      })
    }

    await user.merge(data).save()

    return { message: 'Le compte a été mis à jour' }
  }

  public async destroy({ response, params, auth }: HttpContextContract) {
    const user = await User.findOrFail(params.id)
    const admin = await User.findBy('email', 'arthurdanjou@outlook.fr')

    if (auth.user?.id != admin?.id) {
      return response.unauthorized()
    }

    await user.delete()
    return { message: "L'utilisateur a bien été supprimé" }
  }

}
