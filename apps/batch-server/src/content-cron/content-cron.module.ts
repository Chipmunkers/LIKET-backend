import { Module } from '@nestjs/common';
import { KopisModule } from 'apps/batch-server/src/content-cron/external-apis/kopis/kopis.module';

@Module({
  imports: [KopisModule],
})
export class ContentCronModule {}
