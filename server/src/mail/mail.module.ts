import { MailerModule } from '@nestjs-modules/mailer';
import { Module } from '@nestjs/common';
import { AppConfig } from 'src/config/config';
import * as upath from 'upath';
import { MailService } from './mail.service';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';

const CONFIG = AppConfig();

@Module({
  imports: [
    MailerModule.forRoot({
      transport: {
        host: CONFIG.MAIL_HOST,
        port: CONFIG.MAIL_PORT,
        ignoreTLS: CONFIG.MAIL_IGNORE_TLS,
        secure: CONFIG.MAIL_SECURE,
        auth: {
          user: CONFIG.MAIL_USERNAME,
          pass: CONFIG.MAIL_PASSWORD,
        },
      },
      defaults: {
        from: `"${CONFIG.MAIL_FROM_NAME}" <${CONFIG.MAIL_FROM_EMAIL}>`,
      },
      // preview: true,
      template: {
        dir: upath.join(__dirname, '/templates'),
        adapter: new HandlebarsAdapter(),
        options: {
          strict: true,
        },
      },
    }),
  ],
  controllers: [],
  providers: [MailService],
  exports: [MailService],
})
export class MailModule {}
