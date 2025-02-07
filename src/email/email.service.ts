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
import { ConfigService } from '@nestjs/config';
import { IEmail } from './types/email.interface';

@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailLogService.name);

  constructor(
    @Inject('NODEMAILER') private readonly transporter: Transporter,
    @Inject(MAX_RETRIES) private readonly maxRetries: number,
    @InjectQueue('emailQueue')
    private readonly emailQueue: Queue<SendEmailDto & { logId: string }>,
    private readonly emailLogService: EmailLogService,
    private readonly configService: ConfigService,
  ) {}

  async enqueueEmail(sendEmailDto: SendEmailDto) {
    const log = await this.emailLogService.createLog(sendEmailDto);
    await this.emailQueue.add(
      { ...sendEmailDto, logId: log.id },
      { attempts: this.maxRetries + 1, backoff: 5000 },
    );

    this.logger.log('Email добавлен в очередь', { logId: log.id });

    return log.id;
  }

  async sendEmail(email: IEmail) {
    let html: string | undefined = undefined;

    if (email.template && email.templateData) {
      html = await this.compileTemplate(email.template, email.templateData);
    }

    return this.transporter.sendMail({
      from:
        this.configService.get<string>('SMTP_FROM') ||
        '"No Reply" <noreply@example.com>',
      to: email.to,
      subject: email.subject,
      text: email.text,
      html,
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
