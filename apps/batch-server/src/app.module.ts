import { Module } from '@nestjs/common';
import { KopisModule } from './content-cron/external-apis/kopis/kopis.module';
import { ConfigModule } from '@nestjs/config';
import { KakaoAddressModule } from '../../../libs/modules/src/kakao-address/kakao-address.module';
import { ContentCronModule } from 'apps/batch-server/src/content-cron/content-cron.module';
import { DiscordModule } from 'libs/modules/discord/discord.module';

@Module({
  imports: [
    KopisModule,
    ConfigModule.forRoot(),
    KakaoAddressModule,
    ContentCronModule,
  ],
})
export class AppModule {}
