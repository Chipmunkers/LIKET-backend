import { Injectable } from '@nestjs/common';
import { PerformEntity } from 'apps/batch-server/src/content-cron/external-apis/kopis/entity/perform.entity';
import { SummaryPerformEntity } from 'apps/batch-server/src/content-cron/external-apis/kopis/entity/summary-perform.entity';
import { KopisPerformApiAdapter } from 'apps/batch-server/src/content-cron/external-apis/kopis/kopis-perform-api.adapter';
import { KopisPerformProvider } from 'apps/batch-server/src/content-cron/external-apis/kopis/provider/kopis-perform.provider';
import { MonthInfo } from 'apps/batch-server/src/content-cron/external-apis/kopis/type/MonthInfo';
import { IExternalApiAdapterService } from 'apps/batch-server/src/content-cron/interface/external-api-adapter.service';
import { IExternalApiService } from 'apps/batch-server/src/content-cron/interface/external-api.service';

@Injectable()
export class KopisPerformApiService
  implements IExternalApiService<SummaryPerformEntity, PerformEntity>
{
  constructor(
    private readonly kopisPerformProvider: KopisPerformProvider,
    private readonly KopisPerformApiAdapter: KopisPerformApiAdapter,
  ) {}

  /**
   * @author jochongs
   */
  public async getSummaryAll(): Promise<SummaryPerformEntity[]> {
    const result: SummaryPerformEntity[] = [];

    for (const monthInfo of this.getThreeMonthSequence()) {
      const summaryPerformList = await this.getSummaryPerformWithMonthInfo(
        monthInfo,
      );

      const idList = result.map((data) => data.mt20id);
      for (const summaryPerform of summaryPerformList) {
        if (idList.includes(summaryPerform.mt20id)) {
          continue;
        }

        result.push(summaryPerform);
      }
    }

    return result;
  }

  /**
   * @author jochongs
   */
  public async getDetail(data: SummaryPerformEntity): Promise<PerformEntity> {
    return this.kopisPerformProvider.getPerformById(data.mt20id);
  }

  /**
   * @author jochongs
   */
  public getAdapter(): IExternalApiAdapterService<PerformEntity> {
    return this.KopisPerformApiAdapter;
  }

  /**
   * @author jochongs
   */
  public getId(data: SummaryPerformEntity): string {
    return data.mt20id;
  }

  /**
   * @author jochongs
   */
  public async getDetailById(performId: string): Promise<PerformEntity> {
    return await this.kopisPerformProvider.getPerformById(performId);
  }

  /**
   * API 요청 결과 가져오기
   *
   * @author jochongs
   */
  private async getSummaryPerformWithMonthInfo(monthInfo: MonthInfo) {
    const result: SummaryPerformEntity[] = [];
    let page = 1;
    while (true) {
      const summaryPerformList = await this.kopisPerformProvider.getPerformAll({
        cpage: page,
        rows: 100,
        stdate: this.getYYYYMMDDformat(monthInfo.startDate),
        eddate: this.getYYYYMMDDformat(monthInfo.endDate),
        afterdate: this.getYesterday(),
      });

      const idList = result.map((data) => data.mt20id);
      for (const summaryPerform of summaryPerformList) {
        if (idList.includes(summaryPerform.mt20id)) {
          continue;
        }

        result.push(summaryPerform);
      }

      if (summaryPerformList.length !== 100) {
        break;
      }

      page++;
    }

    return result;
  }

  /**
   * 오늘 부터 3달을 31일을 기준으로 쪼개어 시작일과 마지막일을 가져오는 메서드
   *
   * @author jochongs
   */
  private getThreeMonthSequence(): MonthInfo[] {
    const threeMonthSequence: MonthInfo[] = [];

    for (let i = 0; i < 3; i++) {
      if (i === 0) {
        threeMonthSequence.push(this.getNextMonth());
        continue;
      }

      const beforeMonthInfo = threeMonthSequence[i - 1];

      threeMonthSequence.push(this.getNextMonth(beforeMonthInfo.endDate));
    }

    return threeMonthSequence;
  }

  /**
   * 어제 날짜를 가져오는 메서드.
   *
   * @author jochongs
   */
  private getYesterday() {
    const date = new Date();

    date.setHours(date.getHours() - 24);

    return this.getYYYYMMDDformat(date);
  }

  /**
   * 첫 파라미터를 기준으로 31일 뒤를 가져오는 메서드.
   * 정확히 다음 달 같은 날짜가 아닌 31일 뒤를 가져온다는 점 주의.
   *
   * @author jochongs
   */
  private getNextMonth(today: Date = new Date()): MonthInfo {
    const endDate = new Date();
    endDate.setDate(endDate.getDate() + 31);

    return {
      startDate: today,
      endDate: endDate,
    };
  }

  /**
   * YYYYMMDD 포맷으로 만들어 리턴하는 메서드
   *
   * @author jochongs
   */
  private getYYYYMMDDformat(date: Date) {
    return `${date.getFullYear().toString()}${(date.getMonth() + 1)
      .toString()
      .padStart(2, '0')}${date.getDate().toString().padStart(2, '0')}`;
  }
}
