import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import tourConfig from 'apps/batch-server/src/content-cron/external-apis/tour/config/tour.config';
import { OpenAIModule, S3Module } from 'libs/modules';

@Module({
  imports: [
    HttpModule,
    ConfigModule.forFeature(tourConfig),
    S3Module,
    OpenAIModule,
  ],
  providers: [],
  exports: [],
})
export class TourModule {}
