import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';

@Injectable()
export class EmailLibService {
  constructor(private mailerService: MailerService) {}

  async sendEmailForASLContactUs(name: string, email: string, message: string) {
    await this.mailerService.sendMail({
      to: 'erlandazakaria@gmail.com',
      subject: 'New Contact Us',
      template: './asl-contact-us',
      context: { name, email, message },
    });
  }
}
