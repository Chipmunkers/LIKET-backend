import { Module } from '@nestjs/common';
import { MetricController } from './metric.controller';
import { PrismaModule } from 'libs/modules';

@Module({
  imports: [PrismaModule],
  controllers: [MetricController],
})
export class MetricModule {}
