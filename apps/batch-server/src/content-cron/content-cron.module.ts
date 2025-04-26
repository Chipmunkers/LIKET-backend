import { Logger, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';
import domainConfig from 'apps/batch-server/src/content-cron/config/domain.config';
import { ContentCronController } from 'apps/batch-server/src/content-cron/content-cron.controller';
import { ContentCronSchedule } from 'apps/batch-server/src/content-cron/content-cron.schedule';
import { ContentCronService } from 'apps/batch-server/src/content-cron/content-cron.service';
import { KopisModule } from 'apps/batch-server/src/content-cron/external-apis/kopis/kopis.module';
import { TourModule } from 'apps/batch-server/src/content-cron/external-apis/tour/tour.module';
import { ContentTokenModule } from 'apps/batch-server/src/content-token/content-token.module';
import { CultureContentCoreModule } from 'libs/core/culture-content/culture-content-core.module';
import { DiscordModule } from 'libs/modules/discord/discord.module';

@Module({
  imports: [
    KopisModule,
    ScheduleModule.forRoot(),
    TourModule,
    DiscordModule,
    ContentTokenModule,
    ConfigModule.forFeature(domainConfig),
    CultureContentCoreModule,
  ],
  providers: [ContentCronService, ContentCronSchedule, Logger],
  controllers: [ContentCronController],
})
export class ContentCronModule {}
