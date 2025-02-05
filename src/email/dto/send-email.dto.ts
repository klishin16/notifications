import { IsString } from 'class-validator';

export class SendEmailDto {
  @IsString()
  public to: string;

  @IsString()
  public subject: string;

  @IsString()
  public text: string;
}
