import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { SearchAddressResponseDto } from './dto/response/serach-address.dto';
import { KakaoAddressAPIException } from './exception/KakaoAddressAPIException';
import { KeywordSearchResultEntity } from 'libs/modules/kakao-address/entity/keyword-search-result.entity';
import { KeywordSearchResponseDto } from 'libs/modules/kakao-address/dto/response/keyword-search.dto';

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
              size: 10,
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

  /**
   * 키워드로 장소를 검색하는 메서드
   *
   * @author jochongs
   *
   * @param keyword 검색할 주소
   */
  public async searchKeyword(
    keyword: string,
    page: number = 1,
  ): Promise<KeywordSearchResultEntity> {
    try {
      const result =
        await this.httpService.axiosRef.get<KeywordSearchResponseDto>(
          'https://dapi.kakao.com/v2/local/search/keyword.json',
          {
            headers: {
              Authorization: `KakaoAK ${this.KAKAO_APPLICATION_REST_API_KEY}`,
            },
            params: {
              query: keyword,
              size: 10,
              page,
            },
          },
        );

      return KeywordSearchResultEntity.createEntity(result.data);
    } catch (err: any) {
      throw new KakaoAddressAPIException(
        'Fail to GET kakao keyword search',
        err,
      );
    }
  }
}
