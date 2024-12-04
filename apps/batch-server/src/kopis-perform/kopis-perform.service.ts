import { Injectable } from '@nestjs/common';
import { GetPerformAllDto } from './dto/request/get-perform-all.dto';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { parseStringPromise } from 'xml2js';
import { GetPerformAllResponseDto } from './dto/response/get-perfom-all.dto';
import { SummaryPerformEntity } from './entity/summary-perform.entity';

@Injectable()
export class KopisPerformService {
  private readonly KOPIS_SERVICE_KEY: string;

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {
    this.KOPIS_SERVICE_KEY = this.configService.get('kopis').key || '';
  }

  /**
   * 오늘 업데이트된 데이터 전부 가져오기
   *
   * @author jochongs
   */
  public async getSummaryPerformAllUpdatedAfterToday() {
    let page = 1;

    const summaryPerformList: SummaryPerformEntity[] = [];

    while (true) {
      const performs = await this.getPerformAll({
        rows: 100,
        cpage: page,
        afterdate: '',
      });

      performs.forEach((perform) => summaryPerformList.push(perform));

      if (performs.length < 100) {
        break;
      }

      page++;
    }

    return summaryPerformList;
  }

  /**
   * 공연 정보 전부 가져오기
   *
   * 가장 low level API 요청입니다.
   *
   * @author jochongs
   */
  public async getPerformAll(dto: GetPerformAllDto) {
    const result = await this.httpService.axiosRef.get(
      'http://www.kopis.or.kr/openApi/restful/pblprfr',
      {
        params: {
          service: this.KOPIS_SERVICE_KEY,
          ...dto,
        },
      },
    );

    const data: GetPerformAllResponseDto = await parseStringPromise(
      result.data,
      {
        explicitArray: false,
      },
    );

    return data.dbs.db;
  }
}
