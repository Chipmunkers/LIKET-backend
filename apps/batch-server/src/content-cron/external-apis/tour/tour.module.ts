import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import tourConfig from 'apps/batch-server/src/content-cron/external-apis/tour/config/tour.config';
import { TourApiProvider } from 'apps/batch-server/src/content-cron/external-apis/tour/provider/tour-api.provider';
import { OpenAIModule, S3Module } from 'libs/modules';

@Module({
  imports: [
    HttpModule,
    ConfigModule.forFeature(tourConfig),
    S3Module,
    OpenAIModule,
  ],
  providers: [TourApiProvider],
  exports: [],
})
export class TourModule {}
