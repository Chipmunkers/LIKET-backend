import { Module } from '@nestjs/common';
import { TempContentModule } from './temp-content/temp-content.module';
import { KopisModule } from './kopis-perform/kopis.module';
import { ConfigModule } from '@nestjs/config';
import { KakaoAddressModule } from './kakao-address/kakao-address.module';

@Module({
  imports: [
    TempContentModule,
    KopisModule,
    ConfigModule.forRoot(),
    KakaoAddressModule,
  ],
})
export class AppModule {}
