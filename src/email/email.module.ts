import { Module } from '@nestjs/common';
import { EmailController } from './email.controller';
import { EmailService } from './email.service';
import { BullModule } from '@nestjs/bull';
import { EmailProcessor } from './email.processor';
import { nodemailerProvider } from './nodemailer.provider';
import { EmailLogService } from './email-log.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EmailLog } from './entities/email-log.entity';
import { ConfigModule } from '@nestjs/config';
import { MAX_RETRIES } from './constants';

@Module({
  imports: [
    BullModule.registerQueue({
      name: 'emailQueue',
    }),
    TypeOrmModule.forFeature([EmailLog]),
    ConfigModule,
  ],
  controllers: [EmailController],
  providers: [
    {
      provide: MAX_RETRIES,
      useValue: 3,
    },
    EmailService,
    EmailLogService,
    EmailProcessor,
    nodemailerProvider,
  ],
})
export class EmailModule {}
