import { Injectable, Logger } from '@nestjs/common';
import { GetPerformAllDto } from './dto/request/get-perform-all.dto';
import { HttpService } from '@nestjs/axios';
import { parseStringPromise } from 'xml2js';
import { GetPerformAllResponseDto } from './dto/response/get-perform-all.dto';
import { SummaryPerformEntity } from './entity/summary-perform.entity';
import { GetPerformByIdResponseDto } from './dto/response/get-perform-by-id.dto';
import { FacilityService } from './kopis.facility.service';
import { KopisKeyService } from './kopis-key.service';
import { KopisErrorResponseDto } from './dto/response/kopis-error-response.dto';

@Injectable()
export class KopisPerformService {
  constructor(
    private readonly httpService: HttpService,
    private readonly logger: Logger,
    private readonly KopisKeyService: KopisKeyService,
    private readonly facilityService: FacilityService,
  ) {}

  /**
   * 오늘 업데이트된 데이터 전부 가져오기 (요약으로 가져옴)
   *
   * @author jochongs
   */
  public async getSummaryPerformAllUpdatedAfterToday() {
    let page = 1;

    const summaryPerformList: SummaryPerformEntity[] = [];

    while (true) {
      this.logger.debug('HTTP GET Perform all, page = ' + page);
      const performs = await this.getPerformAll({
        rows: 100,
        cpage: page,
        afterdate: this.getYesterday(),
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
        const perform = await this.getPerformById(summaryPerform.mt20id);

        const facility = await this.facilityService.getFacilityByPerform(
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
          service: this.KopisKeyService.getKey(),
          ...dto,
        },
      },
    );

    const data = await this.parseXMLtoJSON<
      GetPerformAllResponseDto | KopisErrorResponseDto
    >(result.data);

    if (this.isKopisErrorResponse(data)) {
      throw new Error(JSON.stringify(data));
    }

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
    this.logger.debug(
      this.getPerformById.name,
      'HTTP GET Detail Perform | id = ' + id,
    );
    const SERVICE_KEY = this.KopisKeyService.getKey();
    const result = await this.httpService.axiosRef.get(
      `http://www.kopis.or.kr/openApi/restful/pblprfr/${id}`,
      {
        params: {
          service: SERVICE_KEY,
        },
      },
    );

    const data = await this.parseXMLtoJSON<
      GetPerformByIdResponseDto | KopisErrorResponseDto
    >(result.data);

    if (this.isKopisErrorResponse(data)) {
      this.logger.error(
        'Used Service key = ' + SERVICE_KEY,
        this.getPerformById.name,
      );
      this.logger.error(data, this.getPerformById.name);
      throw new Error(JSON.stringify({ ...data, SERVICE_KEY }));
    }

    return data.dbs.db;
  }

  /**
   * XML 데이터를 JSON 데이로 바꿔주는 메서드
   *
   * @author jochongs
   */
  private async parseXMLtoJSON<T = any>(value: any): Promise<T> {
    return await parseStringPromise(value, {
      explicitArray: false,
      emptyTag: () => null,
    });
  }

  /**
   * 에러 판별
   */
  private isKopisErrorResponse(
    value:
      | GetPerformAllResponseDto
      | KopisErrorResponseDto
      | GetPerformByIdResponseDto,
  ): value is KopisErrorResponseDto {
    const obj = value.dbs.db;

    if ((obj as any).returncode) return true;

    return false;
  }
}
