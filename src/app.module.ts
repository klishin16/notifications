import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { BullModule } from '@nestjs/bull';
import { EmailModule } from './email/email.module';
import { CommonModule } from './common/common.module';

import * as Joi from 'joi';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object({
        REDIS_HOST: Joi.string().required(),
        REDIS_PORT: Joi.number().required(),
        DB_HOST: Joi.string().required(),
        DB_PORT: Joi.number().required(),
        DB_USERNAME: Joi.string().required(),
        DB_PASSWORD: Joi.string().required(),
        DB_DATABASE: Joi.string().required(),
        DB_LOGGING: Joi.string().valid('all'),
        EMAIL_MAX_RETRIES: Joi.number(),
        SMTP_HOST: Joi.string().required(),
        SMTP_PORT: Joi.number(),
        SMTP_USER: Joi.string().required(),
        SMTP_PASSWORD: Joi.string().required(),
      }),
    }),
    BullModule.forRootAsync({
      useFactory: (configService: ConfigService) => ({
        redis: configService.get<string>('REDIS_HOST'),
        port: configService.get<number>('REDIS_PORT') || 6379,
      }),
      inject: [ConfigService],
    }),
    EmailModule,
    CommonModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
