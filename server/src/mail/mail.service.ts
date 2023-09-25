import { MailerService } from '@nestjs-modules/mailer';
import { Injectable, Logger } from '@nestjs/common';
import * as AsyncRetry from 'async-retry';
import { AppConfig } from 'src/config/config';

const CONFIG = AppConfig();

export interface MailConfig {
  to: string;
  cc?: string | string[];
  bcc?: string | string[];
  subject: string;
  template?: string;
}

const defaultRetryOptions: AsyncRetry.Options = {
  retries: 3,
  minTimeout: 500,
  maxTimeout: 2000,
};

@Injectable()
export class MailService {
  constructor(private readonly mailerService: MailerService) {}

  public async send(
    config: MailConfig,
    context?: object | any,
    attachments?: any[],
  ): Promise<void> {
    if (CONFIG.MAIL_DRIVER === 'log') {
      Logger.log(
        `Sending "${config?.subject}" email to ${config?.to}.`,
        MailService.name,
      );
      return;
    }

    const mailConfig = {
      ...config,
      template: config.template,
      context: context,
    };

    let to = mailConfig.to;
    const cc = (
      mailConfig.cc == null
        ? []
        : mailConfig.cc === typeof 'string'
        ? [mailConfig.cc]
        : (mailConfig.cc as string[])
    ).filter((x) => x && x.includes('@0xpayments.net') === false);

    if (cc.length === 0) {
      if (!to) {
        Logger.warn(
          `No TO email address provided for "${config?.subject}" email.`,
          MailService.name,
        );
        return;
      }
    }

    if (to.includes('@0xpayments.net')) {
      to = cc[0];
      cc.shift();
    }

    AsyncRetry(async () => {
      try {
        await this.mailerService.sendMail({
          ...mailConfig,
          to,
          cc,
          // html,
          // attachments is not supported into "ISendMailOptions" interface of the library,
          // but it sends entire mail/message object to nodemailer. so we currently ignore the typescript error,
          // and pass the attachments.
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          attachments: attachments,
        });

        Logger.log(`Email sent to: ${to}`);
      } catch (error) {
        Logger.error(
          `Failed to send "${config?.subject}" email to ${config?.to}.`,
          MailService.name,
        );
        Logger.error(error, null, MailService.name);
        throw error;
      }
    }, defaultRetryOptions).catch((error) => {
      Logger.error(error, null, `${MailService.name}.async-retry`);
    });
  }
}
