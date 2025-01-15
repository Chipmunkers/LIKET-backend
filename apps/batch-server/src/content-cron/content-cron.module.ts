import { Logger, Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { ContentCronController } from 'apps/batch-server/src/content-cron/content-cron.controller';
import { ContentCronSchedule } from 'apps/batch-server/src/content-cron/content-cron.schedule';
import { ContentCronService } from 'apps/batch-server/src/content-cron/content-cron.service';
import { CultureContentModule } from 'apps/batch-server/src/content-cron/culture-content/culture-content.module';
import { KopisModule } from 'apps/batch-server/src/content-cron/external-apis/kopis/kopis.module';
import { TourModule } from 'apps/batch-server/src/content-cron/external-apis/tour/tour.module';
import { ContentTokenModule } from 'apps/batch-server/src/content-token/content-token.module';
import { DiscordModule } from 'libs/modules/discord/discord.module';

@Module({
  imports: [
    KopisModule,
    CultureContentModule,
    ScheduleModule.forRoot(),
    TourModule,
    DiscordModule,
    ContentTokenModule,
  ],
  providers: [ContentCronService, ContentCronSchedule, Logger],
  controllers: [ContentCronController],
})
export class ContentCronModule {}
