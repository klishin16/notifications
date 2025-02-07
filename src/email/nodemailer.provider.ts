import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';

export const nodemailerProvider = {
  provide: 'NODEMAILER',
  useFactory: (configService: ConfigService) => {
    return nodemailer.createTransport({
      host: configService.get<string>('SMTP_HOST') || 'smtp.example.com',
      port: Number(configService.get<string>('SMTP_PORT')) || 587,
      auth: {
        user:
          configService.get<string>('SMTP_USER') || 'your-email@example.com',
        pass: configService.get<string>('SMTP_PASSWORD') || 'your-password',
      },
    });
  },
  inject: [ConfigService],
};
