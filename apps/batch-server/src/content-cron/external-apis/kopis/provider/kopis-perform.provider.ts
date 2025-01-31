import { Injectable } from '@nestjs/common';
import { GetPerformAllDto } from '../dto/request/get-perform-all.dto';
import { HttpService } from '@nestjs/axios';
import { parseStringPromise } from 'xml2js';
import { GetPerformAllResponseDto } from '../dto/response/get-perform-all.dto';
import { GetPerformByIdResponseDto } from '../dto/response/get-perform-by-id.dto';
import { KopisKeyProvider } from './kopis-key.provider';
import { KopisErrorResponseDto } from '../dto/response/kopis-error-response.dto';
import { KopisAPIException } from '../exception/KopisAPIException';
import { KopisPerformNotFoundException } from 'apps/batch-server/src/content-cron/external-apis/kopis/exception/KopisPerformNotFoundException';
import { SummaryPerformEntity } from 'apps/batch-server/src/content-cron/external-apis/kopis/entity/summary-perform.entity';

@Injectable()
export class KopisPerformProvider {
  constructor(
    private readonly httpService: HttpService,
    private readonly kopisKeyProvider: KopisKeyProvider,
  ) {}

  /**
   * 공연 정보 전부 가져오기
   *
   * 가장 low level API 요청입니다.
   *
   * @author jochongs
   */
  public async getPerformAll(
    dto: GetPerformAllDto,
  ): Promise<SummaryPerformEntity[]> {
    const result = await this.httpService.axiosRef.get(
      'http://www.kopis.or.kr/openApi/restful/pblprfr',
      {
        params: {
          service: this.kopisKeyProvider.getKey(),
          ...dto,
        },
      },
    );

    const data = await this.parseXMLtoJSON<
      GetPerformAllResponseDto | KopisErrorResponseDto
    >(result.data);

    if (this.isKopisErrorResponse(data)) {
      throw new KopisAPIException('Fail to GET perform list', data);
    }

    if (!data.dbs?.db) {
      return [];
    }

    if (Array.isArray(data.dbs.db)) {
      return data.dbs.db;
    }

    return [data.dbs.db];
  }

  /**
   * 공연 정보 자세히보기
   *
   * 가장 low level API 요청입니다.
   *
   * @author jochongs
   */
  public async getPerformById(id: string) {
    const SERVICE_KEY = this.kopisKeyProvider.getKey();
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
      throw new KopisAPIException('Fail to GET detail perform', data);
    }

    if (!data.dbs) {
      throw new KopisPerformNotFoundException(`Cannot find perform id = ${id}`);
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
    const obj = value?.dbs?.db;

    if (!obj) return false;

    if ((obj as any).returncode) return true;

    return false;
  }
}
