import { Injectable, Logger } from '@nestjs/common';
import { TempContentService } from './temp-content.service';
import { Cron } from '@nestjs/schedule';

@Injectable()
export class TempContentSchedule {
  constructor(
    private readonly tempContentService: TempContentService,
    private readonly logger: Logger,
  ) {}

  /**
   * 00시 00분 01초에 전날 데이터를 불러오는 API
   *
   * @author jochongs
   */
  @Cron('1 0 0 * * *')
  async savePerformListCronJob() {
    // const date = new Date();
    // this.logger.log(`Start: ${date.toLocaleString()}`, 'kopis-cron');
    // try {
    //   await this.tempContentService.saveAllPerformFromKopisAPI();
    // } catch (err) {
    //   this.logger.error('Fail to save perform list', 'kopis-cron');
    //   console.log(err);
    // }
    // this.logger.log(`End: ${date.toLocaleString()}`, 'kopis-cron');
  }
}
