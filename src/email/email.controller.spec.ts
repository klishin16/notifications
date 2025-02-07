import { Test, TestingModule } from '@nestjs/testing';
import { EmailController } from './email.controller';
import { EmailService } from './email.service';
import { EmailLogService } from './email-log.service';
import { ConfigService } from '@nestjs/config';
import { mockedConfigService } from '../units/mocks/config.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { EmailLog } from './entities/email-log.entity';
import { MAX_RETRIES } from './constants';
import * as crypto from 'node:crypto';

describe('EmailController', () => {
  let controller: EmailController;
  let emailService: EmailService;
  let emailLogService: EmailLogService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [EmailController],
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

    controller = module.get<EmailController>(EmailController);
    emailService = module.get<EmailService>(EmailService);
    emailLogService = module.get<EmailLogService>(EmailLogService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should return message and logId', async () => {
    const logId: string = crypto.randomUUID();

    jest
      .spyOn(emailService, 'enqueueEmail')
      .mockImplementationOnce(() => Promise.resolve(logId));

    expect(
      await controller.sendEmail({ to: '', subject: '', text: '' }),
    ).toStrictEqual({
      message: 'Email добавлен в очередь',
      logId,
    });
  });

  it('should return template', async () => {
    jest
      .spyOn(emailService, 'compileTemplate')
      .mockResolvedValue('Test template');

    const result = await controller.previewEmail('welcome', {
      name: 'Anonymous',
      code: '1234',
    });

    expect(result).toStrictEqual({ html: 'Test template' });
  });

  it('should return email sent logs', async () => {
    const logIds: string[] = new Array(5).fill(() => crypto.randomUUID());

    jest
      .spyOn(emailLogService, 'logs')
      .mockImplementationOnce(() => Promise.resolve(logIds));

    expect(await controller.logs({})).toBe(logIds);
  });

  it('should return email log by id', async () => {
    const logId: string = crypto.randomUUID();
    const emailLog = new EmailLog();
    emailLog.id = crypto.randomUUID();

    jest
      .spyOn(emailLogService, 'log')
      .mockImplementationOnce(() => Promise.resolve(emailLog));

    expect(await controller.log(logId)).toStrictEqual(emailLog);
  });
});
