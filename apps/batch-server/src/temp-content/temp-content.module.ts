import { Logger, Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { KopisModule } from '../kopis-perform/kopis.module';
import { KakaoAddressModule } from '../kakao-address/kakao-address.module';
import { TempContentSchedule } from './temp-content.schedule';
import { TempContentService } from './temp-content.service';
import { PrismaModule, S3Module } from 'libs/modules';
import { TempContentRepository } from 'apps/batch-server/src/temp-content/temp-content.repository';
import { TempContentPipeService } from './temp-content-pipe.service';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    KopisModule,
    KakaoAddressModule,
    S3Module,
    PrismaModule,
  ],
  providers: [
    Logger,
    TempContentSchedule,
    TempContentService,
    TempContentRepository,
    TempContentPipeService,
  ],
})
export class TempContentModule {}
