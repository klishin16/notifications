import { ConfigService } from '@nestjs/config';
import { nodemailerProvider } from './nodemailer.provider';

describe('Nodemailer provider', () => {
  it('should return nodemailer', () => {
    expect(
      nodemailerProvider.useFactory({
        get: () => undefined,
      } as unknown as ConfigService),
    ).toBeDefined();
  });
});
