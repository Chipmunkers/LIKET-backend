import { Controller, Get, Query } from '@nestjs/common';
import { AddressService } from 'apps/user-server/src/api/address/address.service';
import { SearchAddressDto } from 'apps/user-server/src/api/address/dto/request/search-address.dto';
import { SearchAddressResponseDto } from 'apps/user-server/src/api/address/dto/response/search-address-response.dto';
import { LoginAuth } from 'apps/user-server/src/api/auth/login-auth.decorator';

@Controller('/address')
export class AddressController {
  constructor(private readonly addressService: AddressService) {}

  /**
   * 주소 검색 API
   *
   * 카카오를 통해 검색
   */
  @LoginAuth()
  @Get('/all')
  async searchAddress(
    @Query() dto: SearchAddressDto,
  ): Promise<SearchAddressResponseDto> {
    const addressList = await this.addressService.searchAddress(dto);

    return { addressList };
  }
}
