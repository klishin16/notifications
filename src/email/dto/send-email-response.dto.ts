import { ApiProperty } from '@nestjs/swagger';

export class SendEmailResponseDto {
  @ApiProperty({ description: 'Message', nullable: false })
  public message: string;

  @ApiProperty({ description: 'LogId', nullable: false })
  public logId: string;
}
