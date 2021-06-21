import {HttpContextContract} from '@ioc:Adonis/Core/HttpContext'
import User from "App/Models/User";
import UserStoreValidator from "../../../app/Validators/users/UserStoreValidator";
import UserUpdateValidator from "../../../app/Validators/users/UserUpdateValidator";

export default class UsersController {

  public async index () {
    return User.query()
  }

  public async store ({request}: HttpContextContract) {
    const data = await request.validate(UserStoreValidator)
    return await User.create(data)
  }

  public async show ({params}: HttpContextContract) {
    return await User.findOrFail(params.id)
  }

  public async update({ request, params, response }: HttpContextContract) {
    const user = await User.findOrFail(params.id)
    const data = await request.validate(UserUpdateValidator)
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
