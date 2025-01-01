import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { GetSummaryFestivalAllDto } from 'apps/batch-server/src/content-cron/external-apis/tour/dto/request/get-summary-festival-all.dto';
import { GetFestivalAllResponseDto } from 'apps/batch-server/src/content-cron/external-apis/tour/dto/response/get-festival-all-response.dto';
import { GetFestivalByIdResponseDto } from 'apps/batch-server/src/content-cron/external-apis/tour/dto/response/get-festival-by-id-response.dto';
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

    return data.response.body.items.item;
  }

  /**
   * 페스티벌 정보 가져오기
   *
   * @author jochongs
   */
  public async getFestivalInfoById(id: string): Promise<{
    intro: string | null;
    description: string | null;
  }> {
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
      throw new FestivalNotFoundException(id, 'Cannot found festival');
    }

    return {
      intro: data.response.body.items[0].infotext ?? null,
      description: data.response.body.items[1].infotext ?? null,
    };
  }
}
