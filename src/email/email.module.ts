import { Module } from '@nestjs/common';
import { EmailController } from './email.controller';
import { EmailService } from './email.service';
import { BullModule } from '@nestjs/bull';
import { EmailProcessor } from './email.processor';
import { nodemailerProvider } from './nodemailer.provider';
import { EmailLogService } from './email-log.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EmailLog } from './entities/email-log.entity';

@Module({
  imports: [
    BullModule.registerQueue({
      name: 'emailQueue',
    }),
    TypeOrmModule.forFeature([EmailLog]),
  ],
  controllers: [EmailController],
  providers: [
    EmailService,
    EmailLogService,
    EmailProcessor,
    nodemailerProvider,
  ],
})
export class EmailModule {}
