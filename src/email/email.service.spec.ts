import { Test, TestingModule } from '@nestjs/testing';
import { EmailService } from './email.service';
import { MAX_RETRIES } from './constants';
import { EmailLogService } from './email-log.service';
import { ConfigService } from '@nestjs/config';
import { mockedConfigService } from '../units/mocks/config.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { EmailLog } from './entities/email-log.entity';
import * as crypto from 'node:crypto';
import { Repository } from 'typeorm';

describe('EmailService', () => {
  let service: EmailService;
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

    service = module.get<EmailService>(EmailService);
    repository = module.get(getRepositoryToken(EmailLog));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return log id', async () => {
    const logId: string = crypto.randomUUID();

    jest.spyOn(repository, 'create').mockImplementation(() => {
      const emailLog = new EmailLog();
      emailLog.id = logId;

      return emailLog;
    });

    jest
      .spyOn(repository, 'save')
      .mockImplementation((v) => Promise.resolve(v as EmailLog));

    const createdLogId = await service.enqueueEmail({
      to: '',
      subject: '',
      text: '',
    });

    expect(createdLogId).toBe(logId);
  });

  it('should send email', async () => {
    expect(
      await service.sendEmail({ to: '', subject: '', text: '' }),
    ).toStrictEqual({ test: 'email' });
  });

  it('should send email with template', async () => {
    expect(
      await service.sendEmail({
        to: '',
        subject: '',
        text: '',
        template: 'welcome',
        templateData: {
          name: 'Anonymous',
          code: '1234',
        },
      }),
    ).toStrictEqual({ test: 'email' });
  });

  it('should return compiled template', async () => {
    expect(
      await service
        .compileTemplate('welcome', {
          name: 'Anonymous',
          code: '1234',
        })
        .then((res) => res.replace(/\s+/g, '')),
    ).toBe(
      `<!DOCTYPE html>
      <html>
        <head>
          <title>Добро пожаловать</title>
        </head>
        <body>
          <h1>Привет, Anonymous!</h1>
          <p>Спасибо, что зарегистрировались на нашем сервисе.</p>
          <p>Ваш код подтверждения: <strong>1234</strong></p>
        </body>
      </html>
    `.replace(/\s+/g, ''),
    );
  });
});
