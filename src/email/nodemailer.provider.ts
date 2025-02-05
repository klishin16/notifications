import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';

export const nodemailerProvider = {
  provide: 'NODEMAILER',
  useFactory: (configService: ConfigService) => {
    return nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'smtp.example.com', // TODO
      port: Number(process.env.SMTP_PORT) || 587,
      auth: {
        user: process.env.SMTP_USER || 'your-email@example.com',
        pass: process.env.SMTP_PASS || 'your-password',
      },
    });
  },
  inject: [ConfigService],
};
