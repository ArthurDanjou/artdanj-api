import {HttpContextContract} from "@ioc:Adonis/Core/HttpContext";

export default class MeController {

  public me ({ response }: HttpContextContract) {
    return response.status(200).send({
      pronouns: "Arthur",
      home: ["Paris", "France"],
      passions: [
        "Dev",
        "DevOps",
        "New technologies",
        "Gaming"
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
        web_app: ["VueJs", "NuxtJs", "Sass", "Tailwind"],
        desktop_app: ["ElectronJs"],
        mobile_app: ["React Native"],
        back_end: {
          typescript: ["AdonisJs"],
          java: ["Spring"]
        },
        databases: ["MongoDB", "MariaDB", "Redis"],
        messaging: ["RabbitMq"],
        other: ["Docker", "Git"],
        architecture: ["microservices", "event-driven", "design system pattern"],
        operating_systems: ['Windows', 'Linux']
      },
    })
  }
}
