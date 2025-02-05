import { IsString } from 'class-validator';
import { IEmail } from '../types/email.interface';

export class SendEmailDto implements IEmail {
  @IsString()
  public to: string;

  @IsString()
  public subject: string;

  @IsString()
  public text: string;
}
