import { Controller, Get } from '@nestjs/common';
import { PrismaProvider } from 'libs/modules';

@Controller('/metric')
export class MetricController {
  constructor(private readonly prisma: PrismaProvider) {}

  @Get()
  async getMetricAll() {
    const metric = await this.prisma.$metrics.prometheus();

    return metric;
  }
}
