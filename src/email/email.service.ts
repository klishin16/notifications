import { Inject, Injectable, Logger } from '@nestjs/common';
import { Transporter } from 'nodemailer';
import { SendEmailDto } from './dto/send-email.dto';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';
import { EmailLogService } from './email-log.service';
import { MAX_RETRIES } from './constants';

@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailLogService.name);

  constructor(
    @Inject('NODEMAILER') private readonly transporter: Transporter,
    @Inject(MAX_RETRIES) private readonly maxRetries: number,
    @InjectQueue('emailQueue')
    private readonly emailQueue: Queue<SendEmailDto & { logId: string }>,
    private readonly emailLogService: EmailLogService,
  ) {}

  async enqueueEmail(sendEmailDto: SendEmailDto) {
    const log = await this.emailLogService.createLog(
      sendEmailDto.to,
      sendEmailDto.subject,
      sendEmailDto.text,
    );
    await this.emailQueue.add(
      { ...sendEmailDto, logId: log.id },
      { attempts: this.maxRetries + 1, backoff: 5000 },
    );

    this.logger.log('Email добавлен в очередь', { logId: log.id });

    return log.id;
  }

  async sendEmail(to: string, subject: string, text: string) {
    return this.transporter.sendMail({
      from: process.env.SMTP_FROM || '"No Reply" <noreply@example.com>',
      to,
      subject,
      text,
    });
  }
}
