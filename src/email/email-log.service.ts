import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { EmailLog } from './entities/email-log.entity';
import { EEmailStatus } from './types/email-status.enum';

@Injectable()
export class EmailLogService {
  constructor(
    @InjectRepository(EmailLog)
    private readonly emailLogRepository: Repository<EmailLog>,
  ) {}

  async createLog(to: string, subject: string, text: string) {
    const log = this.emailLogRepository.create({ to, subject, text });
    return this.emailLogRepository.save(log);
  }

  async updateStatus(id: string, status: EEmailStatus, errorMessage?: string) {
    return this.emailLogRepository.update(id, { status, errorMessage });
  }
}
