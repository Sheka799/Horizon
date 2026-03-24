import { Injectable, Logger } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { Transporter } from 'nodemailer';
import { ConfigService } from '@nestjs/config';
import { isDev } from '../common/utils/is-dev.util';
import { ConfirmationTemplate } from './templates/confirmation.template';
import { render } from '@react-email/components';
import { ResetPasswordTemplate } from './templates/reset-password.template';
import { TwoFactotAuthTemplate } from './templates/two-factor-auth.template';

@Injectable()
export class MailService {
  private transporter: Transporter;
  private readonly logger = new Logger(MailService.name);

  constructor(private readonly configService: ConfigService) {
    this.initializeTransporter();
  }

  private initializeTransporter() {
    this.transporter = nodemailer.createTransport({
      host: this.configService.getOrThrow<string>('MAIL_HOST'),
      port: this.configService.getOrThrow<number>('MAIL_PORT'),
      secure: !isDev(this.configService),
      auth: {
        user: this.configService.getOrThrow<string>('MAIL_LOGIN'),
        pass: this.configService.getOrThrow<string>('MAIL_PASSWORD'),
      }
    });

    this.verifyConnection();
  }

  private async verifyConnection() {
    try {
      await this.transporter.verify();
      this.logger.log('✅ SMTP подключение успешно проверено');
    } catch (error) {
      this.logger.error('❌ Ошибка подключения к SMTP:', error.message);
    }
  }

  public async sendConfirmationEmail(email: string, token: string) {
    const domain = this.configService.getOrThrow<string>('ALLOWED_ORIGIN')
    const html = await render(ConfirmationTemplate({domain, token}))

    return this.send({to: email, subject: 'Подтверждение почты', html: html})
  }

  public async sendPasswordResetEmail(email: string, token: string) {
    const domain = this.configService.getOrThrow<string>('ALLOWED_ORIGIN')
    const html = await render(ResetPasswordTemplate({domain, token}))

    return this.send({to: email, subject: 'Сброс пароля', html: html})
  }

  public async sendTwoFactorTokenEmail(email: string, token: string) {
    const html = await render(TwoFactotAuthTemplate({token}))

    return this.send({to: email, subject: 'Подтверждение вашего аккаунта', html: html})
  }

  async send(options: {
    to: string | string[];
    subject: string;
    text?: string;
    html?: string;
    attachments?: Array<{
      filename: string;
      content?: Buffer | string;
      path?: string;
      contentType?: string;
    }>;
  }) {
    const mailOptions = {
      from: `"Horizon" <${this.configService.getOrThrow<string>('MAIL_LOGIN')}>`,
      ...options,
    };

    try {
      const info = await this.transporter.sendMail(mailOptions);
      this.logger.log(`📧 Письмо отправлено: ${info.messageId}`);
      return { success: true, messageId: info.messageId };
    } catch (error) {
      this.logger.error('❌ Ошибка отправки письма:', error);
      throw new Error(`Не удалось отправить письмо: ${error.message}`);
    }
  }
}