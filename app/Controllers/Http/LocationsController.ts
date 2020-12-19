import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Location from "App/Models/Location";
import LocationValidator from "App/Validators/location/LocationValidator";

export default class LocationsController {

  public async get ({ response }: HttpContextContract) {
    const location = await Location.query().orderBy('since', 'desc').firstOrFail()
    return response.status(200).send({
      place: location.place,
      left: location.left,
      since: location.since
    })
  }

  public async history ({ response }: HttpContextContract) {
    const locations = await Location.query().orderBy('since', 'desc')
    return response.status(200).send({
      locations
    })
  }

  public async add ({ request, response }: HttpContextContract) {
    const data = await request.validate(LocationValidator)
    await Location.create(data)
    return response.status(200).send({
      message: 'Location successfully added !'
    })
  }

}
