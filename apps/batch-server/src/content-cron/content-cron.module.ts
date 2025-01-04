import { Logger, Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { ContentCronSchedule } from 'apps/batch-server/src/content-cron/content-cron.schedule';
import { ContentCronService } from 'apps/batch-server/src/content-cron/content-cron.service';
import { CultureContentModule } from 'apps/batch-server/src/content-cron/culture-content/culture-content.module';
import { KopisModule } from 'apps/batch-server/src/content-cron/external-apis/kopis/kopis.module';
import { TourModule } from 'apps/batch-server/src/content-cron/external-apis/tour/tour.module';

@Module({
  imports: [
    KopisModule,
    CultureContentModule,
    ScheduleModule.forRoot(),
    TourModule,
  ],
  providers: [ContentCronService, ContentCronSchedule, Logger],
})
export class ContentCronModule {}
