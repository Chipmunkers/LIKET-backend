import { Injectable } from '@nestjs/common';
import { GetPerformAllDto } from './dto/request/get-perform-all.dto';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class KopisPerformService {
  private readonly KOPIS_SERVICE_KEY: string;

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {
    console.log(process.env);
    console.log(configService.get('kopis'));
    this.KOPIS_SERVICE_KEY = this.configService.get('kopis').key || '';
  }

  /**
   * 공연 정보 전부 가져오기
   */
  public async getPerformAll(dto: GetPerformAllDto) {
    console.log({
      service: this.KOPIS_SERVICE_KEY,
      ...dto,
    });

    const result = await this.httpService.axiosRef.get(
      'http://www.kopis.or.kr/openApi/restful/pblprfr',
      {
        params: {
          service: this.KOPIS_SERVICE_KEY,
          ...dto,
        },
      },
    );

    console.log(result.status);
    console.log(result.data);
  }
}
