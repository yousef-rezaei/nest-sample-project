// src/mail/mail.controller.ts
import { Controller, Get, Query } from '@nestjs/common';
import { MailService } from './mail.service';

@Controller('mail')
export class MailController {
  constructor(private readonly mail: MailService) {}

  @Get('test')
  async test(@Query('to') to: string) {
    await this.mail.sendPlain(
      to,
      'NestJS → Brevo test',
      'Hello from NestJS via Brevo SMTP!',
    );
    return { ok: true, to };
  }
}
