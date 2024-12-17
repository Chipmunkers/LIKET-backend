import { HttpModule } from '@nestjs/axios';
import { Logger, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import kopisConfig from './config/kopis.config';
import { KopisPerformProvider } from './provider/kopis-perform.provider';
import { KopisFacilityProvider } from './provider/kopis.facility.provider';
import { KopisKeyProvider } from './provider/kopis-key.provider';
import { KopisPerformApiService } from 'apps/batch-server/src/content-cron/external-apis/kopis/kopis-perform-api.service';

@Module({
  imports: [HttpModule, ConfigModule.forFeature(kopisConfig)],
  providers: [
    KopisPerformProvider,
    KopisFacilityProvider,
    Logger,
    KopisKeyProvider,
    KopisPerformApiService,
  ],
  exports: [KopisPerformApiService],
})
export class KopisModule {}
