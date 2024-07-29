import { Module } from '@nestjs/common';
import { MetricController } from './metric.controller';
import { PrismaModule } from '../../common/module/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [MetricController],
})
export class MetricModule {}
