import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AxiosError } from 'axios';
import {
  GetPedestrianDto,
  Stopover,
} from 'libs/modules/sk-open-api/dto/request/get-pedestrian.dto';
import { GetPedestrianResponseDto } from 'libs/modules/sk-open-api/dto/response/get-pedestrian-response.dto';
import { FailToGetPedestrianRoutes } from 'libs/modules/sk-open-api/exception/FailToGetPedestrianRoutes';
import { NotSupportArea } from 'libs/modules/sk-open-api/exception/NotSupportArea';

@Injectable()
export class SkOpenApiProvider {
  private readonly SK_OPEN_API_APP_KEY: string;

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {
    this.SK_OPEN_API_APP_KEY = this.configService.get('skOpenApi').key;
  }

  /**
   * 보행자 경로 정보를 확인할 수 있는 메서드
   *
   * @author jochongs
   *
   * @link https://openapi.sk.com/products/detail?svcSeq=4&menuSeq=45
   */
  public async getPedestrianRoutes(
    dto: GetPedestrianDto,
  ): Promise<GetPedestrianResponseDto | ''> {
    try {
      const result = await this.httpService.axiosRef.post(
        'https://apis.openapi.sk.com/tmap/routes/pedestrian?version=1',
        {
          startName: dto.startName,
          startX: dto.startX,
          startY: dto.startY,
          endName: dto.endName,
          endX: dto.endX,
          endY: dto.endY,
          passList: this.passList(dto.passList),
        },
        {
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            appKey: this.SK_OPEN_API_APP_KEY,
          },
        },
      );

      return result.data;
    } catch (err) {
      if (err instanceof AxiosError) {
        if (
          err.response?.data.error.id === '400' &&
          err.response.data.error.code === '3102'
        ) {
          throw new NotSupportArea('not support area');
        }

        throw new FailToGetPedestrianRoutes(
          'fail to get pedestrian',
          err.response?.data.error.id || 500,
        );
      }

      throw err;
    }
  }

  /**
   * @author jochongs
   */
  private passList(stopoverList: Stopover[]): undefined | string {
    if (stopoverList.length === 0) return;

    return stopoverList
      .map((stopover) => `${stopover.x},${stopover.y}`)
      .join('_');
  }
}
