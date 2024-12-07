import { Injectable } from '@nestjs/common';
import { TempContentService } from './temp-content.service';
import { Cron } from '@nestjs/schedule';

@Injectable()
export class TempContentSchedule {
  constructor(private readonly tempCultureContentService: TempContentService) {}

  @Cron('1 0 0 * * *')
  async performList() {
    const rawTempContentEntity =
      await this.tempCultureContentService.getDetailPerformAllUpdatedAfterYesterday();
  }
}
