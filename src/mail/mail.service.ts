// src/mail/mail.service.ts
import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class MailService {
  constructor(private readonly mailer: MailerService) {}

  async sendOtp(to: string, code: string | number, purpose = 'login') {
    try {
      const info = await this.mailer.sendMail({
        to,
        from: process.env.MAIL_FROM, // force the verified sender
        subject: `Your ${purpose.toUpperCase()} code`,
        template: 'otp',
        context: { code, purpose },
      });
      console.log('[MAIL][OTP] sent', {
        to,
        messageId: info?.messageId,
        accepted: info?.accepted,
        rejected: info?.rejected,
        response: info?.response,
      });
    } catch (err) {
      console.error('[MAIL][OTP] ERROR', err);
      throw err;
    }
  }

  async sendPlain(to: string, subject: string, text: string) {
    try {
      const info = await this.mailer.sendMail({
        to,
        from: process.env.MAIL_FROM,
        subject,
        text,
      });
      console.log('[MAIL][PLAIN] sent', {
        to,
        messageId: info?.messageId,
        accepted: info?.accepted,
        rejected: info?.rejected,
        response: info?.response,
      });
    } catch (err) {
      console.error('[MAIL][PLAIN] ERROR', err);
      throw err;
    }
  }

  async sendWelcome(to: string, name?: string) {
    const appName = process.env.APP_NAME ?? 'MyApp';
    const baseUrl = process.env.APP_BASE_URL ?? '#';
    const brandColor = process.env.BRAND_COLOR ?? '#4e73df';
    const helpUrl = process.env.HELP_URL ?? 'mailto:support@yourdomain.tld';
    const ctaUrl =
      baseUrl && baseUrl !== '#'
        ? baseUrl.replace(/\/$/, '') + '/dashboard'
        : '#';

    // return so callers can log info if they want
    return await this.mailer.sendMail({
      to,
      from: process.env.MAIL_FROM,
      subject: `Welcome to ${appName} 👋`,
      template: 'welcome',
      context: {
        name: name ?? 'there',
        appName,
        baseUrl,
        brandColor,
        helpUrl,
        ctaUrl,
      },
    });
  }
}
