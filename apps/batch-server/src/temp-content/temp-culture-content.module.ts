import { Logger, Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { KopisModule } from '../kopis-perform/kopis.module';
import { KakaoAddressModule } from '../kakao-address/kakao-address.module';
import { TempCultureContentSchedule } from './temp-culture-content.schedule';
import { TempCultureContentService } from './temp-culture-content.service';

@Module({
  imports: [ScheduleModule.forRoot(), KopisModule, KakaoAddressModule],
  providers: [Logger, TempCultureContentSchedule, TempCultureContentService],
})
export class TempContentModule {}
