import { Module } from '@nestjs/common';
import { TempContentModule } from './temp-content/temp-content.module';
import { KopisModule } from './content-cron/external-apis/kopis/kopis.module';
import { ConfigModule } from '@nestjs/config';
import { KakaoAddressModule } from './kakao-address/kakao-address.module';
import { ContentCronModule } from 'apps/batch-server/src/content-cron/content-cron.module';

@Module({
  imports: [
    KopisModule,
    ConfigModule.forRoot(),
    KakaoAddressModule,
    ContentCronModule,
  ],
})
export class AppModule {}
