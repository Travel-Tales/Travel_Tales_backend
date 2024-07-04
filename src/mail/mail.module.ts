import { MailerModule } from '@nestjs-modules/mailer';
import { Module } from '@nestjs/common';
import { MailService } from './mail.service';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import * as path from 'path';

@Module({
  imports: [
    MailerModule.forRoot({
      transport: {
        host: 'smtp.mailgun.org',
        port: 587,
        secure: false,
        auth: {
          user: 'postmaster@sandbox189cb096ac624fc8bd9dc44ef75aae99.mailgun.org',
          pass: 'ef0c4a600bb36205508b363917dbdf29-e5475b88-e4fafc29',
        },
      },
    }),
  ],
  providers: [MailService],
  exports: [MailService],
})
export class MailModule {}
