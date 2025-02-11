import { Test, TestingModule } from '@nestjs/testing';
import { StatisticsController } from './statistics.controller';
import { StatisticsService } from './statistics.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { EmailLog } from '../email/entities/email-log.entity';

describe('StatisticsController', () => {
  let controller: StatisticsController;
  let statisticsService: StatisticsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [StatisticsController],
      providers: [
        StatisticsService,
        {
          provide: getRepositoryToken(EmailLog),
          useValue: {},
        },
      ],
    }).compile();

    controller = module.get<StatisticsController>(StatisticsController);
    statisticsService = module.get(StatisticsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should return stats', async () => {
    jest.spyOn(statisticsService, 'getStats').mockResolvedValue({});

    expect(await controller.getStats()).toStrictEqual({});
  });

  it('should return count', async () => {
    jest.spyOn(statisticsService, 'count').mockResolvedValue(1);

    expect(await controller.count()).toBe(1);
  });

  it('should return stats', async () => {
    jest.spyOn(statisticsService, 'getDaysStats').mockResolvedValue([]);

    expect(await controller.getDaysStats()).toStrictEqual([]);
  });
});
