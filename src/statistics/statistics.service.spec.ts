import { Test, TestingModule } from '@nestjs/testing';
import { StatisticsService } from './statistics.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { EmailLog } from '../email/entities/email-log.entity';
import { Repository } from 'typeorm';

describe('StatisticsService', () => {
  let service: StatisticsService;
  let repository: Repository<EmailLog>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        StatisticsService,
        {
          provide: getRepositoryToken(EmailLog),
          useValue: {
            count: jest.fn(),
            query: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<StatisticsService>(StatisticsService);
    repository = module.get(getRepositoryToken(EmailLog));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return count', async () => {
    jest.spyOn(repository, 'count').mockResolvedValue(1);

    expect(await service.count()).toBe(1);
  });

  it('should return stats', async () => {
    jest.spyOn(repository, 'query').mockResolvedValue([]);

    expect(await service.getStats('f', 't')).toStrictEqual([]);
  });

  it('should return days stats', async () => {
    jest.spyOn(repository, 'query').mockResolvedValue([]);

    expect(await service.getDaysStats()).toStrictEqual([]);
  });
});
