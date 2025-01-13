import { Injectable } from '@nestjs/common';
import { KakaoAddressService } from 'libs/modules/kakao-address/kakao-address.service';
import { SearchAddressDto } from 'apps/user-server/src/api/address/dto/request/search-address.dto';
import { KeywordSearchResultEntity } from 'libs/modules/kakao-address/entity/keyword-search-result.entity';

@Injectable()
export class AddressService {
  constructor(private readonly kakaoAddressService: KakaoAddressService) {}

  /**
   * @author jochongs
   */
  public async searchKeyword(
    dto: SearchAddressDto,
  ): Promise<KeywordSearchResultEntity> {
    return await this.kakaoAddressService.searchKeyword(dto.search);
  }
}
