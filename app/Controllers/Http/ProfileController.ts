import {HttpContextContract} from "@ioc:Adonis/Core/HttpContext";
import {getDiscordActivity} from "App/Tasks/GetDiscordActivity";

export default class ProfileController {

  public me ({ response }: HttpContextContract) {
    return response.status(200).send({
      pronouns: "Arthur",
      home: ["Paris", "France"],
      passions: [
        "Dev",
        "DevOps",
        "New technologies",
        "Gaming",
        "Cloud"
      ],
      code: [
        "Javascript",
        "Typescript",
        "HTML",
        "CSS",
        "GoLang",
        "Java"
      ],
      ask_me_about: [
        "Web dev",
        "Tech",
        "Consulting",
        "Cloud computing",
        "DevOps",
        "Software dev"
      ],
      technologies: {
        web_app: ["VueJs", "NuxtJs", "Sass", "TailwindCss", "WindiCss"],
        desktop_app: ["ElectronJs"],
        mobile_app: ["React Native", "Vue Native"],
        back_end: {
          typescript: ["AdonisJs"],
          java: ["Spring"]
        },
        databases: ["MongoDB", "MariaDB", "Redis"],
        messaging: ["RabbitMQ"],
        other: ["Docker", "Git"],
        architecture: ["microservices", "event-driven", "design system pattern"],
        operating_systems: ['MacOS', "Linux"]
      },
    })
  }

  //todo get discord Activity
  public async discord ({ response }: HttpContextContract) {
    const activity = await getDiscordActivity()
    return response.status(200).send({
      status: activity
    })
  }
}
