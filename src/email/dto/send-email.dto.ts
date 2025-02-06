import { IsObject, IsOptional, IsString } from 'class-validator';
import { IEmail } from '../types/email.interface';

export class SendEmailDto implements IEmail {
  @IsString()
  public to: string;

  @IsString()
  public subject: string;

  @IsString()
  public text: string;

  @IsString()
  @IsOptional()
  public template?: string;

  @IsObject()
  public templateData?: Record<string, any>
}
