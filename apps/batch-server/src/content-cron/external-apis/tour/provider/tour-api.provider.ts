import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { GetSummaryFestivalAllDto } from 'apps/batch-server/src/content-cron/external-apis/tour/dto/request/get-summary-festival-all.dto';
import { GetFestivalAllResponseDto } from 'apps/batch-server/src/content-cron/external-apis/tour/dto/response/get-festival-all-response.dto';
import { GetFestivalByIdResponseDto } from 'apps/batch-server/src/content-cron/external-apis/tour/dto/response/get-festival-by-id-response.dto';
import { GetFestivalImgsResponseDto } from 'apps/batch-server/src/content-cron/external-apis/tour/dto/response/get-festival-imgs-response.dto';
import { GetFestivalIntroByIdResponseDto } from 'apps/batch-server/src/content-cron/external-apis/tour/dto/response/get-fetival-intro-by-id-response.dto';
import { FestivalImgEntity } from 'apps/batch-server/src/content-cron/external-apis/tour/entity/festival-img.entity';
import { FestivalInfoEntity } from 'apps/batch-server/src/content-cron/external-apis/tour/entity/festival-info.entity';
import { FestivalIntroEntity } from 'apps/batch-server/src/content-cron/external-apis/tour/entity/festival-intro.entity';
import { FestivalEntity } from 'apps/batch-server/src/content-cron/external-apis/tour/entity/festival.entity';
import { SummaryFestivalEntity } from 'apps/batch-server/src/content-cron/external-apis/tour/entity/summary-festival.entity';
import { FestivalNotFoundException } from 'apps/batch-server/src/content-cron/external-apis/tour/exception/FestivalNotFoundException';

@Injectable()
export class TourApiProvider {
  private readonly TOUR_API_KEY: string;

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {
    this.TOUR_API_KEY = this.configService.get('tour').key;
  }

  /**
   * @author jochongs
   */
  public async getSummaryFestivalAll(
    dto: GetSummaryFestivalAllDto,
  ): Promise<SummaryFestivalEntity[]> {
    const result = await this.httpService.axiosRef.get<
      GetFestivalAllResponseDto | string
    >(`https://apis.data.go.kr/B551011/KorService1/areaBasedSyncList1`, {
      params: {
        numOfRows: dto.numOfRows,
        pageNo: dto.pageNo,
        MobileOS: dto.MobileOS ?? 'ETC',
        MobileApp: dto.MobileApp ?? 'LIKET',
        modifiedtime: dto.modifiedtime,
        listYN: dto.listYN,
        arrange: dto.arrange,
        serviceKey: this.TOUR_API_KEY,
        _type: 'json',
        contentTypeId: 15,
      },
    });

    const data = result.data;

    // ! 주의: Error 발생 시 데이터를 JSON형식으로 주지 않음
    if (typeof data !== 'object') throw new Error(data);

    if (data.response.body.items === '') {
      return [];
    }

    return data.response.body.items.item.map((item) =>
      SummaryFestivalEntity.createEntity(item),
    );
  }

  /**
   * 페스티벌 정보 가져오기
   *
   * @author jochongs
   */
  public async getFestivalInfoById(id: string): Promise<FestivalInfoEntity> {
    const result =
      await this.httpService.axiosRef.get<GetFestivalByIdResponseDto>(
        `https://apis.data.go.kr/B551011/KorService1/detailInfo1`,
        {
          params: {
            MobileOS: 'ETC',
            MobileApp: 'LIKET',
            serviceKey: this.TOUR_API_KEY,
            _type: 'json',
            contentId: id,
            contentTypeId: '15',
          },
        },
      );

    const { data } = result;

    if (data.response.body.items === '') {
      return FestivalInfoEntity.createEntityWithNull();
    }

    const dataList = data.response.body.items.item;

    return FestivalInfoEntity.createEntity(dataList);
  }

  /**
   * 축제 이미지 가져오기
   * !주의: 없는 축제더라도 에러를 뱉지 않음
   *
   * @author jochongs
   */
  public async getFestivalImgs(id: string): Promise<FestivalImgEntity[]> {
    const result =
      await this.httpService.axiosRef.get<GetFestivalImgsResponseDto>(
        `https://apis.data.go.kr/B551011/KorService1/detailImage1`,
        {
          params: {
            MobileOS: 'ETC',
            MobileApp: 'LIKET',
            serviceKey: this.TOUR_API_KEY,
            _type: 'json',
            contentId: id,
            imageYN: 'Y',
            subImageYN: 'Y',
          },
        },
      );

    const data = result.data.response.body;

    if (data.items === '') return [];

    return data.items.item.map((item) =>
      FestivalImgEntity.createEntityFromApi(item),
    );
  }

  /**
   * @author jochongs
   */
  public async getFestivalIntroById(id: string) {
    const result =
      await this.httpService.axiosRef.get<GetFestivalIntroByIdResponseDto>(
        `https://apis.data.go.kr/B551011/KorService1/detailIntro1`,
        {
          params: {
            MobileOS: 'ETC',
            MobileApp: 'LIKET',
            serviceKey: this.TOUR_API_KEY,
            _type: 'json',
            contentId: id,
            contentTypeId: '15',
          },
        },
      );

    const { data } = result;

    if (typeof data !== 'object') {
      throw new Error(data);
    }

    if (data.response.body.items === '') {
      throw new FestivalNotFoundException(id, 'Cannot find festival');
    }

    return FestivalIntroEntity.createEntity(data.response.body.items.item[0]);
  }
}
