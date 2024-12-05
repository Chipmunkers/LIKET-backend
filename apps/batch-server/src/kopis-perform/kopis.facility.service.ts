import { Injectable, Logger } from '@nestjs/common';
import { FacilityEntity } from './entity/facility.entity';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { parseStringPromise } from 'xml2js';
import { GetFacilityByIdDto } from './dto/response/get-facility-by-id.dto';
import { PerformEntity } from './entity/perform.entity';

@Injectable()
export class FacilityService {
  private readonly KOPIS_SERVICE_KEY: string;
  private readonly facilityCacheStore: Record<string, FacilityEntity>;

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
    private readonly logger: Logger,
  ) {
    this.KOPIS_SERVICE_KEY = this.configService.get('kopis').key || '';
  }

  /**
   * 공연의 공연시설 조회하기
   *
   * @author jochongs
   */
  public async getFacilityByPerform(perform: PerformEntity) {
    const facilityId = perform.mt10id;

    if (this.facilityCacheStore[facilityId]) {
      return this.facilityCacheStore[facilityId];
    }

    const facility = await this.getDetailFacilityById(facilityId);

    this.facilityCacheStore[facilityId] = facility;

    return facility;
  }

  /**
   * 공연시설 상세보기
   *
   * 가장 low level 메서드입니다.
   *
   * @author jochongs
   */
  private async getDetailFacilityById(id: string) {
    this.logger.debug(
      this.getDetailFacilityById.name,
      'Get facility | id = ' + id,
    );
    const result = await this.httpService.axiosRef.get(
      `http://www.kopis.or.kr/openApi/restful/prfplc/${id}`,
      {
        params: {
          service: this.KOPIS_SERVICE_KEY,
        },
      },
    );

    const data = await this.parseXMLtoJSON<GetFacilityByIdDto>(result.data);

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
}
