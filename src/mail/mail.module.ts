// src/mail/mail.module.ts
import { Module } from '@nestjs/common';
import { MailerModule } from '@nestjs-modules/mailer';
import { MailService } from './mail.service';
import { MailController } from './mail.controller';

@Module({
  imports: [MailerModule],
  providers: [MailService],
  controllers: [MailController], // for test endpoint
  exports: [MailService],
})
export class MailModule {}
