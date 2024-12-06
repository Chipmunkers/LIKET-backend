import { Injectable } from '@nestjs/common';
import { TempCultureContentService } from './temp-culture-content.service';
import { Cron } from '@nestjs/schedule';

@Injectable()
export class TempCultureContentSchedule {
  constructor(
    private readonly tempCultureContentService: TempCultureContentService,
  ) {}

  @Cron('1 0 0 * * *')
  async performList() {
    const rawTempContentEntity =
      await this.tempCultureContentService.getDetailPerformAllUpdatedAfterYesterday();
  }
}
