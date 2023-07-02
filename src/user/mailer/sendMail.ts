import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';

@Injectable()
export class MailService {
  constructor(private mailerService: MailerService) {}

  sendMail(userMail: string, senderMail: string): void {
    this.mailerService
      .sendMail({
        to: userMail,
        from: senderMail,
        subject: 'test mail',
        text: 'welcome',
        html: '<b>sending email via nestjs nodemailer</b>',
      })
      .then(() => {
        console.log('email sent');
      })
      .catch((error) => {
        throw new Error(`Error sending the message ${error}`);
      });
  }
}
