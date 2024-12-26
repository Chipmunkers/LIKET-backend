import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';

@Injectable()
export class ContentCronSchedule {
  constructor(private readonly logger: Logger) {}

  /**
   * 00시 00분 01초에 전날 데이터를 불러오는 API
   *
   * @author jochongs
   */
  @Cron('1 0 0 * * *')
  async contentCronJob() {}
}
