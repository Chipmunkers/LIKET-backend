import { Logger, Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { KopisModule } from '../kopis-perform/kopis.module';
import { KakaoAddressModule } from '../kakao-address/kakao-address.module';
import { TempCultureContentSchedule } from './temp-culture-content.schedule';
import { TempCultureContentService } from './temp-culture-content.service';
import { S3Module } from 'libs/modules';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    KopisModule,
    KakaoAddressModule,
    S3Module,
  ],
  providers: [Logger, TempCultureContentSchedule, TempCultureContentService],
})
export class TempContentModule {}
