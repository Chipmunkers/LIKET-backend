import { Injectable, Logger } from '@nestjs/common';
import { GetPerformAllDto } from './dto/request/get-perform-all.dto';
import { HttpService } from '@nestjs/axios';
import { parseStringPromise } from 'xml2js';
import { GetPerformAllResponseDto } from './dto/response/get-perform-all.dto';
import { GetPerformByIdResponseDto } from './dto/response/get-perform-by-id.dto';
import { KopisKeyService } from './kopis-key.service';
import { KopisErrorResponseDto } from './dto/response/kopis-error-response.dto';

@Injectable()
export class KopisPerformService {
  constructor(
    private readonly httpService: HttpService,
    private readonly logger: Logger,
    private readonly KopisKeyService: KopisKeyService,
  ) {}

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
  public async getPerformById(id: string) {
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
