import { Process, Processor } from '@nestjs/bull';
import { Job } from 'bull';
import { EmailService } from './email.service';
import { Logger } from '@nestjs/common';
import { EmailLogService } from './email-log.service';
import { EEmailStatus } from './types/email-status.enum';

@Processor('emailQueue')
export class EmailProcessor {
  private readonly logger = new Logger(EmailProcessor.name);

  constructor(
    private readonly emailService: EmailService,
    private readonly emailLogService: EmailLogService,
  ) {}

  @Process()
  async handleEmail(job: Job) {
    const { to, subject, text } = job.data;

    this.logger.log(`📧 Отправка email на ${to}`);

    const log = await this.emailLogService.createLog(to, subject, text);

    try {
      await this.emailService.sendEmail(to, subject, text);
      await this.emailLogService.updateStatus(log.id, EEmailStatus.SENT);
      this.logger.log(`✅ Email успешно отправлен: ${to}`);
    } catch (error) {
      await this.emailLogService.updateStatus(
        log.id,
        EEmailStatus.FAILED,
        error.message,
      );
      console.error(`❌ Ошибка отправки email: ${error.message}`);
    }
  }
}
