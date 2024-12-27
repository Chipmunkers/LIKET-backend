import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { SearchAddressResponseDto } from './dto/response/serach-address.dto';
import { AxiosError } from 'axios';
import { KakaoAddressAPIException } from './exception/KakaoAddressAPIException';

@Injectable()
export class KakaoAddressService {
  private readonly KAKAO_APPLICATION_REST_API_KEY: string;

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {
    this.KAKAO_APPLICATION_REST_API_KEY =
      this.configService.get('kakaoAddress').key;
  }

  /**
   * 주소를 좌표로 변환하는 메서드
   *
   * @author jochongs
   *
   * @param address 검색할 주소
   */
  public async searchAddress(
    address: string,
  ): Promise<SearchAddressResponseDto> {
    try {
      const result =
        await this.httpService.axiosRef.get<SearchAddressResponseDto>(
          'https://dapi.kakao.com/v2/local/search/address.json',
          {
            headers: {
              Authorization: `KakaoAK ${this.KAKAO_APPLICATION_REST_API_KEY}`,
            },
            params: {
              query: address,
            },
          },
        );

      if (result.data.documents.length === 0) {
        throw new KakaoAddressAPIException('Fail to GET kakao address', {
          requestContext: {
            address,
          },
        });
      }

      return result.data;
    } catch (err: any) {
      throw new KakaoAddressAPIException('Fail to GET kakao address', err);
    }
  }
}
