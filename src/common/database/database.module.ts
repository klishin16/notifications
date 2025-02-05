import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ConfigService } from '@nestjs/config';
import { getDatabaseOrmConfig } from './database-ormconfig.constant';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      useFactory: getDatabaseOrmConfig,
      inject: [ConfigService],
    }),
  ],
  providers: [],
  exports: [],
})
export class DatabaseModule {}
