import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import FormValidator from "App/Validators/FormValidator";
import Form from "App/Models/Form";
//import FormConfirmation from "App/Mailers/FormConfirmation";

export default class FormsController {

  public async send({ request, response }: HttpContextContract) {
    const data = await request.validate(FormValidator)

    await Form.create(data)

    //await new FormConfirmation(data.name, data.email).sendLater()
    //todo send confirmation email + email to me
    return response.status(200).send({
      status: 200
    })
  }

}
