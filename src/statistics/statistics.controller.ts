import { Controller, Get, Query } from '@nestjs/common';
import { StatisticsService } from './statistics.service';

@Controller('statistics')
export class StatisticsController {
  constructor(private readonly statisticsService: StatisticsService) {}

  @Get()
  async getStats(
    @Query('fromDate') fromDate?: string,
    @Query('toDate') toDate?: string,
  ) {
    return this.statisticsService.getStats(fromDate, toDate);
  }

  @Get('count')
  public count() {
    return this.statisticsService.count();
  }

  @Get('daysStats')
  async getDaysStats() {
    return this.statisticsService.getDaysStats();
  }
}
