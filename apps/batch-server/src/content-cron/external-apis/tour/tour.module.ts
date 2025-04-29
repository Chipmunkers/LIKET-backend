import { HttpModule } from '@nestjs/axios';
import { Logger, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import tourConfig from 'apps/batch-server/src/content-cron/external-apis/tour/config/tour.config';
import { TourApiProvider } from 'apps/batch-server/src/content-cron/external-apis/tour/provider/tour-api.provider';
import { TourApiAdapter } from 'apps/batch-server/src/content-cron/external-apis/tour/tour-api.adapter';
import { TourApiService } from 'apps/batch-server/src/content-cron/external-apis/tour/tour-api.service';
import { KakaoAddressModule } from 'libs/modules/kakao-address/kakao-address.module';
import { OpenAIModule, RetryUtilModule, S3Module } from 'libs/modules';

@Module({
  imports: [
    HttpModule,
    ConfigModule.forFeature(tourConfig),
    S3Module,
    OpenAIModule,
    KakaoAddressModule,
    RetryUtilModule,
  ],
  providers: [TourApiProvider, TourApiService, TourApiAdapter, Logger],
  exports: [TourApiService],
})
export class TourModule {}
