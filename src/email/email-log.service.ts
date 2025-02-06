import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { EmailLog } from './entities/email-log.entity';
import { EEmailStatus } from './types/email-status.enum';
import { IEmail } from './types/email.interface';

@Injectable()
export class EmailLogService {
  constructor(
    @InjectRepository(EmailLog)
    private readonly emailLogRepository: Repository<EmailLog>,
  ) {}

  async createLog(email: IEmail) {
    const log = this.emailLogRepository.create(email);
    return this.emailLogRepository.save(log);
  }

  async updateStatus(id: string, status: EEmailStatus, errorMessage?: string) {
    return this.emailLogRepository.update(id, { status, errorMessage });
  }

  async incrementRetryCount(id: string) {
    await this.emailLogRepository.increment({ id }, 'retryCount', 1);
  }
}
