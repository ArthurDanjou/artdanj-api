import type { MessageContract } from '@ioc:Adonis/Addons/Mail'
import { BaseMailer } from '@ioc:Adonis/Addons/Mail'

export default class FormConfirmation extends BaseMailer {
  constructor(private name: string, private email: string) {
    super()
  }

  /* public html = mjml(View.render('emails/confirmation_form', {
    name: this.name
  })).html */

  public prepare(message: MessageContract) {
    message
      .from('no-reply@arthurdanjou.fr')
      .replyTo('contact@arthurdanjou.fr')
      .to(this.email)
      .subject('Thank you for contacting !')
      .htmlView('emails/confirmation_form', {
        name: this.name,
        url: 'https://arthurdanjou.fr',
      })
  }
}
