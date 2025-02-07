import { Test, TestingModule } from '@nestjs/testing';
import { EmailService } from './email.service';
import { MAX_RETRIES } from './constants';
import { EmailLogService } from './email-log.service';
import { ConfigService } from '@nestjs/config';
import { mockedConfigService } from '../units/mocks/config.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { EmailLog } from './entities/email-log.entity';
import * as crypto from 'node:crypto';
import { EmailProcessor } from './email.processor';
import { Job } from 'bull';

describe('EmailProcessor', () => {
  let processor: EmailProcessor;
  let emailService: EmailService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EmailProcessor,
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
          },
        },
      ],
    })
      .useMocker((token) => {
        if (token === 'NODEMAILER') {
          return { sendMail: jest.fn().mockResolvedValue({ test: 'email' }) };
        }

        if (token === MAX_RETRIES) {
          return 3;
        }

        if (token === 'BullQueue_emailQueue') {
          return { add: jest.fn() };
        }
      })
      .compile();

    processor = module.get<EmailProcessor>(EmailProcessor);
    emailService = module.get<EmailService>(EmailService);
  });

  it('should be defined', () => {
    expect(processor).toBeDefined();
  });

  it('should handle email', async () => {
    const logId: string = crypto.randomUUID();
    let sent = false;

    jest.spyOn(emailService, 'sendEmail').mockImplementation(() => {
      sent = true;
      return Promise.resolve(logId);
    });

    await processor.handleEmail({
      id: 1,
      data: { logId, to: '', subject: '', text: '' },
    } as Job);

    expect(sent).toBeTruthy();
  });

  it('should handle email with retries', async () => {
    const logId: string = crypto.randomUUID();

    jest.spyOn(emailService, 'sendEmail').mockImplementation(() => {
      return Promise.reject('error');
    });

    jest.spyOn(console, 'warn').mockReturnValue();

    return await processor
      .handleEmail({
        id: 1,
        attemptsMade: 0,
        data: { logId, to: '', subject: '', text: '' },
      } as Job)
      .catch((e) => {
        expect(e).toBe('error');
      });
  });

  it('should handle email with finally error', async () => {
    const logId: string = crypto.randomUUID();

    jest.spyOn(emailService, 'sendEmail').mockImplementation(() => {
      return Promise.reject({ message: 'error' });
    });

    jest.spyOn(console, 'error').mockImplementation((v) => {
      expect(v).toBe('❌ Email окончательно не отправлен: , ошибка: error');
    });

    await processor.handleEmail({
      id: 1,
      attemptsMade: 3,
      data: { logId, to: '', subject: '', text: '' },
    } as Job);
  });
});
