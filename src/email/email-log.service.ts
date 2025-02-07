import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { EmailLog } from './entities/email-log.entity';
import { EEmailStatus } from './types/email-status.enum';
import { IEmail } from './types/email.interface';
import { IPagination } from '../common/types/pagination.interface';

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
    return this.emailLogRepository.increment({ id }, 'retryCount', 1);
  }

  public async logs(
    pagination: IPagination,
    filters: {
      status?: string;
      fromDate?: string;
      toDate?: string;
    },
  ) {
    const qb = this.emailLogRepository
      .createQueryBuilder('email')
      .limit(pagination.limit)
      .offset(pagination.skip);

    if (filters.status) {
      qb.andWhere('email.status = :status', { status: filters.status });
    }

    if (filters.fromDate) {
      qb.andWhere('email.fromDate > :from', { from: filters.fromDate });
    }

    if (filters.toDate) {
      qb.andWhere('email.toDate < :to', { to: filters.toDate });
    }

    return qb.execute();
  }

  public async log(logId: string) {
    return this.emailLogRepository.findOne({ where: { id: logId } });
  }
}
