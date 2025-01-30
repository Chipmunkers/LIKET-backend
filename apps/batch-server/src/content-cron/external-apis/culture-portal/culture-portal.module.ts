import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import culturePortalConfig from 'apps/batch-server/src/content-cron/external-apis/culture-portal/config/culture-portal.config';
import { CulturePortalProvider } from 'apps/batch-server/src/content-cron/external-apis/culture-portal/provider/culture-portal.provider';
import { OpenAIModule, S3Module } from 'libs/modules';
import { KakaoAddressModule } from 'libs/modules/kakao-address/kakao-address.module';

@Module({
  imports: [
    HttpModule,
    ConfigModule.forFeature(culturePortalConfig),
    S3Module,
    OpenAIModule,
    KakaoAddressModule,
  ],
  providers: [CulturePortalProvider],
  exports: [],
})
export class CulturePortalModule {}
