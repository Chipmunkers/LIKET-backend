import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { ContentCronService } from 'apps/batch-server/src/content-cron/content-cron.service';

@Injectable()
export class ContentCronSchedule {
  constructor(private readonly contentCronService: ContentCronService) {}

  /**
   * 00시 00분 01초에 전날 데이터를 불러오는 API
   *
   * @author jochongs
   */
  @Cron('1 0 0 * * *')
  async contentCronJob() {
    await this.contentCronService.saveContentFromExternalAPI();
  }
}
