import { Test, TestingModule } from '@nestjs/testing';
import { EmailService } from './email.service';
import { MAX_RETRIES } from './constants';
import { EmailLogService } from './email-log.service';
import { ConfigService } from '@nestjs/config';
import { mockedConfigService } from '../units/mocks/config.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { EmailLog } from './entities/email-log.entity';

describe('EmailService', () => {
  let service: EmailService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EmailService,
        EmailLogService,
        { provide: ConfigService, useValue: mockedConfigService },
        { provide: getRepositoryToken(EmailLog), useValue: {} },
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

    service = module.get<EmailService>(EmailService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
