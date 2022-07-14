import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class ProfileController {
  public me({ response }: HttpContextContract) {
    return response.status(200).send({
      pronouns: 'Arthur',
      home: ['Paris', 'France'],
      passions: [
        'Dev',
        'DevOps',
        'New technologies',
        'Gaming',
        'Cloud',
      ],
      code: [
        'Javascript',
        'Typescript',
        'HTML',
        'CSS',
        'Rust',
        'Java',
      ],
      ask_me_about: [
        'Web dev',
        'Tech',
        'Consulting',
        'Cloud computing',
        'DevOps',
        'Software dev',
      ],
      technologies: {
        web_app: ['VueJs', 'NuxtJs', 'Sass', 'TailwindCss', 'WindiCss'],
        desktop_app: ['TauriStudio'],
        mobile_app: ['Vue Native'],
        back_end: {
          typescript: ['AdonisJs'],
        },
        databases: ['MongoDB', 'MariaDB', 'Redis'],
        messaging: ['RabbitMQ'],
        other: ['Docker', 'Git'],
        operating_systems: ['MacOS', 'Linux'],
      },
    })
  }
}
