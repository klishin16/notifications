import { Process, Processor } from '@nestjs/bull';
import { Job } from 'bull';
import { EmailService } from './email.service';
import { Inject, Logger } from '@nestjs/common';
import { EmailLogService } from './email-log.service';
import { EEmailStatus } from './types/email-status.enum';
import { MAX_RETRIES } from './constants';
import { IEmailJob } from './types/email-job.interface';

@Processor('emailQueue')
export class EmailProcessor {
  private readonly logger = new Logger(EmailProcessor.name);

  constructor(
    private readonly emailService: EmailService,
    private readonly emailLogService: EmailLogService,
    @Inject(MAX_RETRIES) private readonly maxRetries: number,
  ) {}

  @Process()
  async handleEmail(job: Job<IEmailJob>) {
    const { logId, ...email } = job.data;

    this.logger.log(`📧 Отправка email на ${email.to}`);

    await this.emailLogService.updateStatus(logId, EEmailStatus.PENDING);

    try {
      await this.emailService.sendEmail(email);
      await this.emailLogService.updateStatus(logId, EEmailStatus.SENT);
      this.logger.log(`✅ Email успешно отправлен: ${email.to}`);
    } catch (error) {
      if (job.attemptsMade < this.maxRetries) {
        await this.emailLogService.incrementRetryCount(logId);

        console.warn(
          `⚠️ Ошибка отправки email, повторная попытка ${job.attemptsMade + 1}/${this.maxRetries}`,
        );

        throw error; // Позволяет Bull автоматически повторить задачу
      } else {
        await this.emailLogService.updateStatus(
          logId,
          EEmailStatus.FAILED,
          error.message,
        );
        console.error(
          `❌ Email окончательно не отправлен: ${email.to}, ошибка: ${error.message}`,
        );
      }
    }
  }
}
