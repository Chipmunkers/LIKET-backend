import { Injectable, Logger, LoggerService } from '@nestjs/common';
import { GetPerformAllDto } from './dto/request/get-perform-all.dto';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { parseStringPromise } from 'xml2js';
import { GetPerformAllResponseDto } from './dto/response/get-perform-all.dto';
import { SummaryPerformEntity } from './entity/summary-perform.entity';
import { GetPerformByIdResponseDto } from './dto/response/get-perform-by-id.dto';

@Injectable()
export class KopisPerformService {
  private readonly KOPIS_SERVICE_KEY: string;

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
    private readonly logger: Logger,
  ) {
    this.KOPIS_SERVICE_KEY = this.configService.get('kopis').key || '';
  }

  /**
   * 오늘 업데이트된 데이터 전부 가져오기 (요약으로 가져옴)
   *
   * @author jochongs
   */
  public async getSummaryPerformAllUpdatedAfterToday() {
    let page = 1;

    const summaryPerformList: SummaryPerformEntity[] = [];

    while (true) {
      this.logger.log('HTTP Request. page = ' + page);
      const performs = await this.getPerformAll({
        rows: 100,
        cpage: page,
        afterdate: this.getToday(),
      });

      const performIdList = summaryPerformList.map((perform) => perform.mt20id);

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
   * 오늘 업데이트 된 데이터 전부 자세히보기로 가져오기
   *
   * @author jochongs
   */
  public async getDetailPerformAllUpdatedAfterToday() {
    const summaryPerformList =
      await this.getSummaryPerformAllUpdatedAfterToday();

    return await Promise.all(
      summaryPerformList.map((summaryPerform) =>
        this.getPerformById(summaryPerform.mt20id),
      ),
    );
  }

  /**
   * 오늘 날짜 데이터를 포맷화해서 가져오기
   *
   * @returns 20241204
   */
  private getToday() {
    const date = new Date();

    return `${date.getFullYear().toString()}${(date.getMonth() + 1)
      .toString()
      .padStart(2, '0')}${date.getDate().toString().padStart(2, '0')}`;
  }

  /**
   * 공연 정보 전부 가져오기
   *
   * 가장 low level API 요청입니다.
   *
   * @author jochongs
   */
  private async getPerformAll(dto: GetPerformAllDto) {
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

  /**
   * 공연 정보 자세히보기
   *
   * 가장 low level API 요청입니다.
   *
   * @author jochongs
   */
  private async getPerformById(id: string) {
    this.logger.log(
      this.getPerformById.name,
      'Request Detail Perform | id = ' + id,
    );
    const result = await this.httpService.axiosRef.get(
      `http://www.kopis.or.kr/openApi/restful/pblprfr/${id}`,
      {
        params: {
          service: this.KOPIS_SERVICE_KEY,
        },
      },
    );

    const data: GetPerformByIdResponseDto = await parseStringPromise(
      result.data,
      {
        explicitArray: false,
        emptyTag: () => null,
      },
    );

    return data.dbs.db;
  }
}
