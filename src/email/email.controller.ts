import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  Render,
} from '@nestjs/common';
import { SendEmailDto } from './dto/send-email.dto';
import { EmailService } from './email.service';
import { Pagination } from '../common/decorators/pagination.decorator';
import { IPagination } from '../common/types/pagination.interface';
import { EmailLogService } from './email-log.service';
import {
  ApiBody,
  ApiOkResponse,
  ApiOperation,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { SendEmailResponseDto } from './dto/send-email-response.dto';

@ApiTags('email')
@Controller('email')
export class EmailController {
  constructor(
    private readonly emailService: EmailService,
    private readonly emailLogService: EmailLogService,
  ) {}

  @ApiOperation({ summary: 'Send email' })
  @ApiBody({ type: SendEmailDto })
  @ApiOkResponse({ type: SendEmailResponseDto })
  @Post('send')
  public async sendEmail(@Body() sendEmailDto: SendEmailDto) {
    const logId = await this.emailService.enqueueEmail(sendEmailDto);

    return { message: 'Email добавлен в очередь', logId };
  }

  @ApiOperation({ summary: 'Preview email in browser' })
  @ApiQuery({
    name: 'template',
    type: String,
    description: 'Email template',
  })
  @ApiQuery({
    name: 'templateData',
    type: Object,
    description: 'Email template data',
  })
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

  @ApiOperation({ summary: 'Show email sent logs' })
  @ApiQuery({ name: 'status', required: false })
  @ApiQuery({ name: 'fromDate', required: false })
  @ApiQuery({ name: 'toDate', required: false })
  @Get('logs')
  public async logs(
    @Pagination() pagination: IPagination,
    @Query('status') status?: string,
    @Query('fromDate') fromDate?: string,
    @Query('toDate') toDate?: string,
  ) {
    return this.emailLogService.logs(pagination, {
      status,
      fromDate,
      toDate,
    });
  }

  @ApiOperation({ summary: 'Show email log by id' })
  @Get(':id')
  async log(@Param('id') id: string) {
    return this.emailLogService.log(id);
  }

  @Get('logs/stats')
  async getStats(
    @Query('fromDate') fromDate?: string,
    @Query('toDate') toDate?: string,
  ) {
    return this.emailLogService.getStats(fromDate, toDate);
  }

  @Get('logs/latest')
  async getLatestLogs(@Query('limit') limit = 10) {
    return this.emailLogService.getLatestLogs(limit);
  }
}
