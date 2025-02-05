import { Body, Controller, Get, Post, Query, Render } from '@nestjs/common';
import { SendEmailDto } from './dto/send-email.dto';
import { EmailService } from './email.service';

@Controller('email')
export class EmailController {
  constructor(private readonly emailService: EmailService) {}

  @Post('send')
  async sendEmail(@Body() sendEmailDto: SendEmailDto) {
    const logId = await this.emailService.enqueueEmail(sendEmailDto);

    return { message: 'Email добавлен в очередь', logId };
  }

  @Get('preview')
  @Render('preview')
  async previewEmail(
    @Query('template') template: string,
    @Query() templateData: Record<string, any>,
  ) {
    const html = await this.emailService.compileTemplate(
      template,
      templateData,
    );
    return { html };
  }
}
