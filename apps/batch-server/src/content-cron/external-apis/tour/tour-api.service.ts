import { Injectable } from '@nestjs/common';
import { FestivalEntity } from 'apps/batch-server/src/content-cron/external-apis/tour/entity/festival.entity';
import { SummaryFestivalEntity } from 'apps/batch-server/src/content-cron/external-apis/tour/entity/summary-festival.entity';
import { TourApiProvider } from 'apps/batch-server/src/content-cron/external-apis/tour/provider/tour-api.provider';
import { TourApiAdapter } from 'apps/batch-server/src/content-cron/external-apis/tour/tour-api.adapter';
import { IExternalApiAdapterService } from 'apps/batch-server/src/content-cron/interface/external-api-adapter.service';
import { IExternalApiService } from 'apps/batch-server/src/content-cron/interface/external-api.service';

@Injectable()
export class TourApiService
  implements IExternalApiService<SummaryFestivalEntity, FestivalEntity>
{
  constructor(
    private readonly tourApiProvider: TourApiProvider,
    private readonly tourApiAdapter: TourApiAdapter,
  ) {}

  /**
   * @author jochongs
   */
  public async getSummaryAll(): Promise<SummaryFestivalEntity[]> {
    return await this.tourApiProvider.getSummaryFestivalAll({
      numOfRows: 500,
      pageNo: 1,
      modifiedtime: this.getYesterday(),
    });
  }

  /**
   * @author jochongs
   */
  public async getDetail(data: SummaryFestivalEntity): Promise<FestivalEntity> {
    const festivalId = this.getId(data);
    const imgList = await this.tourApiProvider.getFestivalImgs(festivalId);

    const festivalInfo = await this.tourApiProvider.getFestivalInfoById(
      festivalId,
    );

    const festivalIntro = await this.tourApiProvider.getFestivalIntroById(
      festivalId,
    );

    return FestivalEntity.createEntity(
      data,
      festivalInfo,
      imgList,
      festivalIntro,
    );
  }

  /**
   * @author jochongs
   */
  public getAdapter(): IExternalApiAdapterService<FestivalEntity> {
    return this.tourApiAdapter;
  }

  /**
   * @author jochongs
   */
  public getId(data: SummaryFestivalEntity): string {
    return data.contentId;
  }

  /**
   * @author jochongs
   */
  public async getDetailById(festivalId: string): Promise<FestivalEntity> {
    throw new Error('not implement');

    // TODO: id로 festival을 가져올 때 summaryData를 가져올 수 없음.
    const imgList = await this.tourApiProvider.getFestivalImgs(festivalId);

    const festivalInfo = await this.tourApiProvider.getFestivalInfoById(
      festivalId,
    );

    const festivalIntro = await this.tourApiProvider.getFestivalIntroById(
      festivalId,
    );

    // return FestivalEntity.createEntity(
    //   data,
    //   festivalInfo,
    //   imgList,
    //   festivalIntro,
    // );
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
