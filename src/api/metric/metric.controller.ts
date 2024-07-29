import { Controller, Get, UseGuards } from '@nestjs/common';
import { PrismaService } from '../../common/module/prisma/prisma.service';

@Controller('/metric')
export class MetricController {
  constructor(private readonly prisma: PrismaService) {}

  @Get()
  async getMetricAll() {
    const metric = await this.prisma.$metrics.prometheus();

    return metric;
  }
}
