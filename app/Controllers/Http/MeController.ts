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
        "Python",
        "Java"
      ],
      askMeAbout: [
        "Web dev",
        "Tech",
        "Consulting",
        "Cloud native",
        "Software dev"
      ],
      technologies: {
        webApp: ["VueJs", "NuxtJs", "Sass", "Tailwind"],
        desktopApp: ["ElectronJs"],
        mobileApp: ["React Native"],
        backEnd: {
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
