import { IsObject, IsOptional, IsString } from 'class-validator';
import { IEmail } from '../types/email.interface';
import { ApiProperty } from '@nestjs/swagger';

export class SendEmailDto implements IEmail {
  @ApiProperty({ description: 'To', nullable: false })
  @IsString()
  public to: string;

  @ApiProperty({ description: 'Subject', nullable: false })
  @IsString()
  public subject: string;

  @ApiProperty({ description: 'Text', nullable: false })
  @IsString()
  public text: string;

  @ApiProperty({ description: 'Template', nullable: true })
  @IsString()
  @IsOptional()
  public template?: string;

  @ApiProperty({
    description: 'Template data',
    nullable: true,
    example: { name: 'Nemo' },
  })
  @IsObject()
  public templateData?: Record<string, any>;
}
