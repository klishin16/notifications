import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EmailLog } from '../email/entities/email-log.entity';
import { Repository } from 'typeorm';

@Injectable()
export class StatisticsService {
  constructor(
    @InjectRepository(EmailLog)
    private readonly emailLogRepository: Repository<EmailLog>,
  ) {}

  public count(): Promise<number> {
    return this.emailLogRepository.count();
  }

  public async getStats(fromDate?: string, toDate?: string) {
    // Базовый запрос
    let query =
      'SELECT status, COUNT(*) AS count FROM email_logs GROUP BY status';

    // Массив для хранения условий WHERE
    const conditions: string[] = [];

    // Объект для хранения параметров
    const params: any[] = [];

    // Добавляем условия, если параметры переданы
    if (fromDate) {
      conditions.push('created_at >= $1');
      params.push(fromDate);
    }

    if (toDate) {
      conditions.push('created_at < $2');
      params.push(toDate);
    }

    // Если есть условия, добавляем их в запрос
    if (conditions.length > 0) {
      query += ' WHERE ' + conditions.join(' AND ');
    }

    return await this.emailLogRepository.query(query, params);
  }

  public async getDaysStats(): Promise<Array<{ date: string; count: number }>> {
    return this.emailLogRepository.query(`
      SELECT created_at::date AS date, COUNT(*) AS count FROM email_logs
      WHERE created_at::date > now() - INTERVAL '30 day'
      GROUP BY created_at::date
    `);
  }

  // create(createStatisticDto: CreateStatisticDto) {
  //   return 'This action adds a new statistic';
  // }
  //
  // findAll() {
  //   return `This action returns all statistics`;
  // }
  //
  // findOne(id: number) {
  //   return `This action returns a #${id} statistic`;
  // }
  //
  // update(id: number, updateStatisticDto: UpdateStatisticDto) {
  //   return `This action updates a #${id} statistic`;
  // }
  //
  // remove(id: number) {
  //   return `This action removes a #${id} statistic`;
  // }
}
