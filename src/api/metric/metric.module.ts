import { Module } from '@nestjs/common';
import { MetricController } from './metric.controller';
import { PrismaModule } from '../../common/module/prisma/prisma.module';
import { ConfigModule } from '@nestjs/config';
import whitelistConfig from './config/whitelist.config';

@Module({
  imports: [PrismaModule, ConfigModule.forFeature(whitelistConfig)],
  controllers: [MetricController],
})
export class MetricModule {}
