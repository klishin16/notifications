import { Body, Controller, Get, Post, Query, Render } from '@nestjs/common';
import { SendEmailDto } from './dto/send-email.dto';
import { EmailService } from './email.service';
import { Pagination } from '../common/decorators/pagination.decorator';
import { IPagination } from '../common/types/pagination.interface';

@Controller('email')
export class EmailController {
  constructor(private readonly emailService: EmailService) {}

  @Post('send')
  public async sendEmail(@Body() sendEmailDto: SendEmailDto) {
    const logId = await this.emailService.enqueueEmail(sendEmailDto);

    return { message: 'Email добавлен в очередь', logId };
  }

  @Get('preview')
  @Render('preview')
  public async previewEmail(
    @Query('template') template: string,
    @Query() templateData: Record<string, any>,
  ) {
    const html = await this.emailService.compileTemplate(
      template,
      templateData,
    );
    return { html };
  }


  @Get('logs')
  public async logs(
    @Pagination() pagination: IPagination,
    @Query('email') email?: string,
    @Query('status') status?: string,
    @Query('fromDate') fromDate?: string,
    @Query('toDate') toDate?: string,
  ) {
    return this.emailService.getLogs({ email, status, fromDate, toDate, limit, offset });
  }

  @Get()
  async getLogs(
    @Query('email') email?: string,
    @Query('status') status?: string,
    @Query('fromDate') fromDate?: string,
    @Query('toDate') toDate?: string,
    @Query('limit') limit = 20,
    @Query('offset') offset = 0,
  ) {
  }

  @Get(':id')
  async getLogById(@Param('id') id: string) {
    return this.emailLogService.getLogById(id);
  }
}
