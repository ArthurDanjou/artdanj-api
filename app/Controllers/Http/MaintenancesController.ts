import {HttpContextContract} from "@ioc:Adonis/Core/HttpContext";
import Maintenance from "App/Models/Maintenance";
import MaintenanceUpdateValidator from "App/Validators/maintenance/MaintenanceUpdateValidator";
import {getTranslation} from "App/Utils/TranslationsUtils";

export default class MaintenancesController {

  public async index ({ response }: HttpContextContract) {
    const maintenance = await Maintenance
      .query()
      .orderBy('created_at', 'desc')
      .preload('reason')
      .first()
    return response.status(200).send({
      maintenance: maintenance
    })
  }

  public async update ({ request, params, response }: HttpContextContract) {
    const data = await request.validate(MaintenanceUpdateValidator)
    const maintenance = await Maintenance.findOrFail(params.id)

    if (data.reason) {
      await maintenance.related('reason').associate(await getTranslation(data.reason))
    }

    await maintenance.merge(data).save()

    return response.status(200).send({
      maintenance
    })
  }

}
