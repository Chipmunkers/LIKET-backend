import { HttpModule } from '@nestjs/axios';
import { Logger, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import kopisConfig from './config/kopis.config';
import { KopisPerformProvider } from './provider/kopis-perform.provider';
import { KopisFacilityProvider } from './provider/kopis.facility.provider';
import { KopisKeyProvider } from './provider/kopis-key.provider';
import { KopisPerformApiService } from 'apps/batch-server/src/content-cron/external-apis/kopis/kopis-perform-api.service';
import { KopisPerformApiAdapter } from 'apps/batch-server/src/content-cron/external-apis/kopis/kopis-perform-api.adapter';
import { S3Module } from 'libs/modules';
import { KakaoAddressModule } from 'apps/batch-server/src/kakao-address/kakao-address.module';

@Module({
  imports: [
    HttpModule,
    ConfigModule.forFeature(kopisConfig),
    S3Module,
    KakaoAddressModule,
  ],
  providers: [
    KopisPerformProvider,
    KopisFacilityProvider,
    Logger,
    KopisKeyProvider,
    KopisPerformApiService,
    KopisPerformApiAdapter,
  ],
  exports: [KopisPerformApiService, KopisPerformApiAdapter],
})
export class KopisModule {}
