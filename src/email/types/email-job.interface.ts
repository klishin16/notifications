import { IEmail } from './email.interface';

export interface IEmailJob extends IEmail {
  logId: string;
}
