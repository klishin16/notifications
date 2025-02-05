import { DataSource, DataSourceOptions } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { config } from 'dotenv';
import { getDatabaseOrmConfig } from './database-ormconfig.constant';

config();

const configService = new ConfigService();

export default new DataSource({
  ...(getDatabaseOrmConfig(configService) as DataSourceOptions),
});
