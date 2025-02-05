import { Inject, Injectable, Logger } from '@nestjs/common';
import { Transporter } from 'nodemailer';
import * as handlebars from 'handlebars';
import { SendEmailDto } from './dto/send-email.dto';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';
import { EmailLogService } from './email-log.service';
import { MAX_RETRIES } from './constants';
import * as path from 'node:path';
import { promises as fs } from 'node:fs';

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

  public async compileTemplate(
    templateName: string,
    data: Record<string, any>,
  ): Promise<string> {
    const templatePath = path.join(
      __dirname,
      'templates',
      `${templateName}.hbs`,
    );
    const templateContent = await fs.readFile(templatePath, 'utf-8');
    const compiledTemplate = handlebars.compile(templateContent);
    return compiledTemplate(data);
  }
}
