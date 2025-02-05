import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';

export const getDatabaseOrmConfig = (
  configService: ConfigService,
): TypeOrmModuleOptions => ({
  type: 'postgres',
  host: process.env.DB_HOST || configService.get('DB_HOST'),
  port:
    (process.env.DB_PORT ? parseInt(process.env.DB_PORT, 10) : null) ||
    configService.get<number>('DB_PORT') ||
    5432,
  username: process.env.DB_USERNAME || configService.get('DB_USERNAME'),
  password: process.env.DB_PASSWORD || configService.get('DB_PASSWORD'),
  database: process.env.DB_DATABASE || configService.get('DB_DATABASE'),
  entities: [__dirname + '/../../**/*.entity{.ts,.js}'],
  migrations: [__dirname + '/migrations/**/*{.ts,.js}'],
  migrationsRun: true,
  synchronize: false,
  logging: configService.get('DB_LOGGING'),
  extra: {
    connectionLimit: 15,
  },
});
