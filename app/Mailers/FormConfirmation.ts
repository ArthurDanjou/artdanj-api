import mjml from 'mjml'
import { BaseMailer, MessageContract } from '@ioc:Adonis/Addons/Mail'
import View from "@ioc:Adonis/Core/View";

export default class FormConfirmation extends BaseMailer {

  constructor (private name: string, private email: string) {
    super()
  }

  public html = mjml(View.render('emails/confirmation_form', {
    name: this.name
  })).html

  public prepare(message: MessageContract) {
    message
      .from('no-reply@arthurdanjou.fr')
      .replyTo('contact@arthurdanjou.fr')
      .to(this.email)
      .subject('Confirmation Form')
      .html(this.html)
  }
}
