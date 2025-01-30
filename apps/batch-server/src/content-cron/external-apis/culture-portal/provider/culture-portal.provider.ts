import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { FailToRequestCulturePortalException } from 'apps/batch-server/src/content-cron/external-apis/culture-portal/exception/FailToRequestCulturePortal';
import { SummaryCulturePortalDisplay } from 'apps/batch-server/src/content-cron/external-apis/culture-portal/type/summary-culture-portal-display';
import { GetDisplayAllErrorResponseDto } from 'apps/batch-server/src/content-cron/external-apis/dto/response/get-display-all-error-response.dto';
import { GetDisplayAllResponseDto } from 'apps/batch-server/src/content-cron/external-apis/dto/response/get-display-all-response.dto';
import { parseStringPromise } from 'xml2js';

@Injectable()
export class CulturePortalProvider {
  private readonly CULTURE_PORTAL_KEY: string;
  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {
    this.CULTURE_PORTAL_KEY = this.configService.get('culturePortal').key;
  }

  /**
   * 기간 검색 조건으로 공연/전시 정보 목록을 조회하는 메서드.
   * 가장 low한 메서드
   *
   * @author jochongs
   *
   * @link https://www.culture.go.kr/industry/apiGuideA.do
   * @link https://www.data.go.kr/data/15138937/openapi.do#/API%20%EB%AA%A9%EB%A1%9D/realm
   */
  public async getPerformanceDisplayAll(
    from: string,
    to: string,
  ): Promise<SummaryCulturePortalDisplay[]> {
    const response = await this.httpService.axiosRef.get<string>(
      `http://apis.data.go.kr/B553457/nopenapi/rest/publicperformancedisplays/realm`,
      {
        params: {
          serviceKey: this.CULTURE_PORTAL_KEY,
          realmCode: 'D000',
          from,
          to,
          PageNo: 1,
          numOfrows: 100000,
        },
      },
    );

    const result = await this.parseXMLtoJSON<
      GetDisplayAllErrorResponseDto | GetDisplayAllResponseDto
    >(response.data);

    if (this.getDisplayAllResponseIsError(result)) {
      throw new FailToRequestCulturePortalException(
        'open api error',
        '99',
        result,
      );
    }

    const resultCode =
      result.response.header.reseultCode || result.response.header.resultCode;

    if (resultCode !== '00') {
      throw new FailToRequestCulturePortalException(
        'culture portal api error',
        resultCode,
        result,
      );
    }

    return result.response.body.items?.item || [];
  }

  /**
   * 공연 정보 자세히보기 API
   *
   * @author jochongs
   *
   * @link https://www.culture.go.kr/industry/apiGuideA.do
   */
  public async getPerformanceDisplayBySeq(seq: string) {
    const result = await this.httpService.axiosRef.get(
      `https://apis.data.go.kr/B553457/nopenapi/rest/publicperformancedisplays/detail`,
      {
        params: {
          serviceKey: this.CULTURE_PORTAL_KEY,
          seq,
        },
      },
    );

    return this.parseXMLtoJSON(result.data);
  }

  /**
   * 공연 시설 검색 메서드.
   *
   * @author jochongs
   *
   * @link https://www.data.go.kr/iim/api/selectAPIAcountView.do
   */
  public async getFacilityAll(search: string) {
    const result = await this.httpService.axiosRef.get(
      `http://apis.data.go.kr/B553457/nopenapi/rest/cultureartspaces`,
      {
        params: {
          serviceKey: this.CULTURE_PORTAL_KEY,
          PageNo: 1,
          numOfrows: 100000,
          keyword: search,
        },
      },
    );

    return this.parseXMLtoJSON(result.data);
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

  private getDisplayAllResponseIsError(
    data: GetDisplayAllErrorResponseDto | GetDisplayAllResponseDto,
  ): data is GetDisplayAllErrorResponseDto {
    if (
      (data as GetDisplayAllErrorResponseDto).OpenAPI_ServiceResponse !==
      undefined
    ) {
      return true;
    }

    return false;
  }
}
