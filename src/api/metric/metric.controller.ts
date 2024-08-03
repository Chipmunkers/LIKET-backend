import { Controller, Get, UseGuards } from '@nestjs/common';
import { PrismaService } from '../../common/module/prisma/prisma.service';
import { Logger } from '../../common/module/logger/logger.decorator';
import { LoggerService } from '../../common/module/logger/logger.service';

@Controller('/metric')
export class MetricController {
  constructor(
    private readonly prisma: PrismaService,
    @Logger(MetricController.name) private readonly logger: LoggerService,
  ) {}

  @Get()
  async getMetricAll() {
    const metric = await this.prisma.$metrics.prometheus();

    return metric;
  }
}
