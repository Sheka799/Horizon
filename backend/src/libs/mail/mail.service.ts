import { Injectable, Logger } from '@nestjs/common';
import { Resend } from 'resend';
import { ConfigService } from '@nestjs/config';
import { ConfirmationTemplate } from './templates/confirmation.template';
import { render } from '@react-email/components';
import { ResetPasswordTemplate } from './templates/reset-password.template';
import { TwoFactotAuthTemplate } from './templates/two-factor-auth.template';

@Injectable()
export class MailService {
  private readonly resend: Resend;
  private readonly logger = new Logger(MailService.name);

  constructor(private readonly configService: ConfigService) {
    // Resend работает через HTTPS (443), а не SMTP (25/465/587) — часть
    // хостингов блокирует исходящий SMTP-трафик, HTTP API этого избегает
    this.resend = new Resend(
      this.configService.getOrThrow<string>('RESEND_API_KEY'),
    );
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
    html: string;
    attachments?: Array<{
      filename: string;
      content?: Buffer | string;
      path?: string;
      contentType?: string;
    }>;
  }) {
    try {
      const { data, error } = await this.resend.emails.send({
        from: `Horizon <${this.configService.getOrThrow<string>('MAIL_FROM')}>`,
        to: options.to,
        subject: options.subject,
        text: options.text,
        html: options.html,
        attachments: options.attachments,
      });

      if (error) {
        throw new Error(error.message);
      }

      this.logger.log(`📧 Письмо отправлено: ${data?.id}`);
      return { success: true, messageId: data?.id };
    } catch (error) {
      this.logger.error('❌ Ошибка отправки письма:', error);
      throw new Error(`Не удалось отправить письмо: ${error.message}`);
    }
  }
}
