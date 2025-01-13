import { Controller, Get, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AddressService } from 'apps/user-server/src/api/address/address.service';
import { SearchAddressDto } from 'apps/user-server/src/api/address/dto/request/search-address.dto';
import { LoginAuth } from 'apps/user-server/src/api/auth/login-auth.decorator';
import { Exception } from 'apps/user-server/src/common/decorator/exception.decorator';
import { KeywordSearchResultEntity } from 'libs/modules/kakao-address/entity/keyword-search-result.entity';

@Controller('/address')
@ApiTags('Address')
export class AddressController {
  constructor(private readonly addressService: AddressService) {}

  /**
   * 키워드를 통해 검색 API
   *
   * 카카오를 통해 검색
   *
   * @author jochongs
   */
  @LoginAuth()
  @Exception(400, 'invalid querystring')
  @Get('/keyword-search/all')
  async searchAddress(
    @Query() dto: SearchAddressDto,
  ): Promise<KeywordSearchResultEntity> {
    return await this.addressService.searchKeyword(dto);
  }
}
