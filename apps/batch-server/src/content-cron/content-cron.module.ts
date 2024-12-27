import { Logger, Module } from '@nestjs/common';
import { ContentCronSchedule } from 'apps/batch-server/src/content-cron/content-cron.schedule';
import { ContentCronService } from 'apps/batch-server/src/content-cron/content-cron.service';
import { CultureContentModule } from 'apps/batch-server/src/content-cron/culture-content/culture-content.module';
import { KopisModule } from 'apps/batch-server/src/content-cron/external-apis/kopis/kopis.module';

@Module({
  imports: [KopisModule, CultureContentModule],
  providers: [ContentCronService, ContentCronSchedule, Logger],
})
export class ContentCronModule {}
