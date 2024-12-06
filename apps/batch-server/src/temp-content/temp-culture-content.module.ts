import { Logger, Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { KopisModule } from '../kopis-perform/kopis.module';
import { KakaoAddressModule } from '../kakao-address/kakao-address.module';
import { TempCultureContentSchedule } from './temp-culture-content.schedule';
import { TempCultureContentService } from './temp-culture-content.service';
import { PrismaModule, S3Module } from 'libs/modules';
import { TempCultureContentRepository } from 'apps/batch-server/src/temp-content/temp-culture-content.repository';

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
    TempCultureContentSchedule,
    TempCultureContentService,
    TempCultureContentRepository,
  ],
})
export class TempContentModule {}
