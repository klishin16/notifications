import { Test, TestingModule } from '@nestjs/testing';
import { EmailService } from './email.service';
import { MAX_RETRIES } from './constants';
import { EmailLogService } from './email-log.service';
import { ConfigService } from '@nestjs/config';
import { mockedConfigService } from '../units/mocks/config.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { EmailLog } from './entities/email-log.entity';
import * as crypto from 'node:crypto';
import { Repository, SelectQueryBuilder, UpdateResult } from 'typeorm';
import { EEmailStatus } from './types/email-status.enum';

describe('EmailLogService', () => {
  let service: EmailLogService;
  let repository: Repository<EmailLog>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EmailService,
        EmailLogService,
        { provide: ConfigService, useValue: mockedConfigService },
        {
          provide: getRepositoryToken(EmailLog),
          useValue: {
            findOne: jest.fn(),
            create: jest.fn(),
            save: jest.fn(),
            update: jest.fn(),
            increment: jest.fn(),
            createQueryBuilder: jest.fn(),
          },
        },
      ],
    })
      .useMocker((token) => {
        if (token === 'NODEMAILER') {
          return { sendMail: jest.fn().mockResolvedValue({ test: 'email' }) };
        }

        if (token === MAX_RETRIES) {
          return 1;
        }

        if (token === 'BullQueue_emailQueue') {
          return { add: jest.fn() };
        }
      })
      .compile();

    service = module.get<EmailLogService>(EmailLogService);
    repository = module.get(getRepositoryToken(EmailLog));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create log', async () => {
    const logId: string = crypto.randomUUID();
    const emailLog = new EmailLog();
    emailLog.id = logId;

    jest.spyOn(repository, 'create').mockReturnValue(emailLog);
    jest
      .spyOn(repository, 'save')
      .mockImplementation((v: EmailLog) => Promise.resolve(v));

    const result = await service.createLog(emailLog);
    expect(result).toEqual(emailLog);
  });

  it('should update status', async () => {
    const logId: string = crypto.randomUUID();

    jest
      .spyOn(repository, 'update')
      .mockResolvedValue({ affected: 1 } as UpdateResult);

    const result = await service.updateStatus(logId, EEmailStatus.PENDING);
    expect(result).toStrictEqual({ affected: 1 });
  });

  it('should update increment retry count', async () => {
    const logId: string = crypto.randomUUID();

    jest
      .spyOn(repository, 'increment')
      .mockResolvedValue({ affected: 1 } as UpdateResult);

    const result = await service.incrementRetryCount(logId);
    expect(result).toStrictEqual({ affected: 1 });
  });

  it('should return log', async () => {
    const logId: string = crypto.randomUUID();
    const emailLog = new EmailLog();
    emailLog.id = logId;

    jest.spyOn(repository, 'findOne').mockResolvedValue(emailLog);

    const result = await service.log(logId);

    expect(result).toStrictEqual(emailLog);
  });

  it('should return logs', async () => {
    const logIds: string[] = new Array(5).fill(() => crypto.randomUUID());

    function MockQueryBuilder(
      execReturn: object,
    ): SelectQueryBuilder<EmailLog> {
      this.limit = function () {
        return this;
      };

      this.offset = function () {
        return this;
      };

      this.andWhere = function () {
        return this;
      };

      this.execute = function () {
        return Promise.resolve(execReturn);
      };

      return this;
    }

    jest.spyOn(repository, 'createQueryBuilder').mockImplementation(() => {
      return new (MockQueryBuilder as any)(logIds);
    });

    const result = await service.logs(
      {},
      {
        status: EEmailStatus.CREATED,
        fromDate: new Date().toISOString(),
        toDate: new Date().toISOString(),
      },
    );

    expect(result).toStrictEqual(logIds);
  });
});
