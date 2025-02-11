import { Module } from '@nestjs/common';
import { StatisticsService } from './statistics.service';
import { StatisticsController } from './statistics.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EmailLog } from '../email/entities/email-log.entity';

@Module({
  imports: [TypeOrmModule.forFeature([EmailLog])],
  controllers: [StatisticsController],
  providers: [StatisticsService],
})
export class StatisticsModule {}
