import {HttpContextContract} from "@ioc:Adonis/Core/HttpContext";
import Information from "App/Models/Information";
import InformationUpdateValidator from "App/Validators/information/InformationUpdateValidator";

export default class InformationsController {

  public async index ( { response }: HttpContextContract ) {
    return response.status(200).send({
      informations: await Information.first()
    })
  }

  public async update ( { response, request }: HttpContextContract ) {
    const information = await Information.firstOrFail()
    const data = await request.validate(InformationUpdateValidator)
    await information.merge(data).save()

    return response.status(200).send({
      information
    })
  }

}
