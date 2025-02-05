import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { SendEmailDto } from '../src/email/dto/send-email.dto';

describe('AppController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/ (GET)', () => {
    return request(app.getHttpServer())
      .get('/')
      .expect(200)
      .expect('Hello World!');
  });

  it('/email/send (POST)', () => {
    return request(app.getHttpServer())
      .post('/email/send')
      .send({
        to: 'test@mail.ru',
        subject: 'Test',
        text: 'Hello world',
      } as SendEmailDto)
      .expect(201);
  });
});
