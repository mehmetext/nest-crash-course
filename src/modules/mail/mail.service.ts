import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MailtrapTransport } from 'mailtrap';
import * as nodemailer from 'nodemailer';

@Injectable()
export class MailService implements OnModuleInit {
  private readonly logger = new Logger(MailService.name);
  private transporter: nodemailer.Transporter;

  constructor(private readonly configService: ConfigService) {
    if (!this.configService.get('MAILTRAP_TOKEN')) {
      throw new Error('MAILTRAP_TOKEN is not set');
    }
  }

  onModuleInit() {
    this.transporter = nodemailer.createTransport(
      MailtrapTransport({
        token: this.configService.get('MAILTRAP_TOKEN')!,
      }),
    );
  }

  async sendMail({
    to,
    subject,
    text,
    html,
  }: {
    to: string[];
    subject: string;
    text?: string;
    html?: string;
  }) {
    const sender = {
      address: 'hello@demomailtrap.co',
      name: 'Mailtrap Test',
    };

    await this.transporter.sendMail({
      from: sender,
      to: to,
      subject,
      text,
      html,
    });
  }
}
