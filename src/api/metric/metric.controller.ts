import { Controller, Get, UseGuards } from '@nestjs/common';
import { PrismaService } from '../../common/module/prisma/prisma.service';
import { MetricWhitelistGuard } from './whitelist.guard';

@Controller('/metric')
export class MetricController {
  constructor(private readonly prisma: PrismaService) {}

  @Get()
  @UseGuards(MetricWhitelistGuard)
  async getMetricAll() {
    const metric = await this.prisma.$metrics.prometheus();

    return metric;
  }
}
