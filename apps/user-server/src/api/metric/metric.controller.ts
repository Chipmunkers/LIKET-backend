import { Controller, Get } from '@nestjs/common';
import { PrismaProvider } from 'libs/modules';

@Controller('/metric')
export class MetricController {
  constructor(private readonly prisma: PrismaProvider) {}

  /**
   * 메트릭 지표 수입을 위한 메서드
   *
   * @author jochongs
   */
  @Get()
  async getMetricAll() {
    const metric = await this.prisma.$metrics.prometheus();

    return metric;
  }
}
