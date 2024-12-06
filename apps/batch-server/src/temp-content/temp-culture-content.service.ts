import { Injectable, Logger } from '@nestjs/common';
import { SummaryPerformEntity } from '../kopis-perform/entity/summary-perform.entity';
import { KopisPerformService } from '../kopis-perform/kopis-perform.service';
import { KopisFacilityService } from '../kopis-perform/kopis.facility.service';

@Injectable()
export class TempCultureContentService {
  constructor(
    private readonly logger: Logger,
    private readonly kopisPerformService: KopisPerformService,
    private readonly kopisFacilityService: KopisFacilityService,
  ) {}

  /**
   * 어제 이후로 업데이트 된 공연 목록보기
   * !주의: 공연과 시설 모두 가져옵니다.
   *
   * 해당 메서드는 API key 사용 횟수가 빠르게 소모됩니다.
   * 하루에 한 번 사용하도록 주의하십시오.
   *
   * @author jochongs
   */
  public async getDetailPerformAllUpdatedAfterYesterday() {
    const summaryPerformList =
      await this.getSummaryPerformAllUpdatedAfterToday();

    return await Promise.all(
      summaryPerformList.map(async (summaryPerform) => {
        const perform = await this.kopisPerformService.getPerformById(
          summaryPerform.mt20id,
        );

        const facility = await this.kopisFacilityService.getFacilityByPerform(
          perform,
        );

        return {
          perform,
          facility,
        };
      }),
    );
  }

  /**
   * 오늘 업데이트된 데이터 전부 가져오기 (요약으로 가져옴)
   *
   * @author jochongs
   */
  private async getSummaryPerformAllUpdatedAfterToday() {
    let page = 1;

    const summaryPerformList: SummaryPerformEntity[] = [];

    while (true) {
      const performs = await this.kopisPerformService.getPerformAll({
        rows: 100,
        cpage: page,
        afterdate: this.getYesterday(),
      });

      const performIdList = summaryPerformList.map((perform) => perform.mt20id);

      this.logger.debug('HTTP GET Perform all, page = ' + page);
      performs.forEach((perform) => {
        if (performIdList.includes(perform.mt20id)) return;

        summaryPerformList.push(perform);
      });

      if (performs.length < 100) {
        break;
      }

      page++;
    }

    return summaryPerformList;
  }

  /**
   * 오늘 날짜 데이터를 포맷화해서 가져오기
   *
   * @returns 20241204
   */
  private getYesterday() {
    const date = new Date();

    date.setHours(date.getHours() - 24);

    return `${date.getFullYear().toString()}${(date.getMonth() + 1)
      .toString()
      .padStart(2, '0')}${date.getDate().toString().padStart(2, '0')}`;
  }
}
