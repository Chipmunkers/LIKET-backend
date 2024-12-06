import { Logger, Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { KopisModule } from '../kopis-perform/kopis.module';
import { KakaoAddressModule } from '../kakao-address/kakao-address.module';

@Module({
  imports: [ScheduleModule.forRoot(), KopisModule, KakaoAddressModule],
  providers: [Logger],
})
export class TempContentModule {}
