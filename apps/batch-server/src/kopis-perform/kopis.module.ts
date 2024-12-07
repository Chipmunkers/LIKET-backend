import { HttpModule } from '@nestjs/axios';
import { Logger, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import kopisConfig from './config/kopis.config';
import { KopisPerformService } from './kopis-perform.service';
import { KopisFacilityService } from './kopis.facility.service';
import { KopisKeyService } from './kopis-key.service';

@Module({
  imports: [HttpModule, ConfigModule.forFeature(kopisConfig)],
  providers: [
    KopisPerformService,
    KopisFacilityService,
    Logger,
    KopisKeyService,
  ],
  exports: [KopisPerformService, KopisFacilityService],
})
export class KopisModule {}
