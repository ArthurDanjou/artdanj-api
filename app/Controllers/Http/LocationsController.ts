import {HttpContextContract} from '@ioc:Adonis/Core/HttpContext'
import Location from "App/Models/Location";
import LocationValidator from "App/Validators/location/LocationValidator";

export default class LocationsController {

  public async get ({ response }: HttpContextContract) {
    const location = await Location.query().orderBy('since', 'desc').first()
    if (location) {
      return response.status(200).send({
        location: {
          place: location.place,
          left: location.left,
          since: location.since
        }
      })
    } else {
      return response.status(200).send({
        location: 'Location is unknown...'
      })
    }
  }

  public async store ({ request, response }: HttpContextContract) {
    const data = await request.validate(LocationValidator)
    await Location.create(data)
    return response.status(200).send({
      message: 'Location successfully added !'
    })
  }

}
