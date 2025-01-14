import { Body, Controller, Get, HttpCode, Post, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AddressService } from 'apps/user-server/src/api/address/address.service';
import { GetPedestrianDto } from 'apps/user-server/src/api/address/dto/request/get-pedestrian.dto';
import { SearchAddressDto } from 'apps/user-server/src/api/address/dto/request/search-address.dto';
import { GetPedestrianRouteResponseDto } from 'apps/user-server/src/api/address/dto/response/get-pedestrian-route-response.dto';
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

  /**
   * 보행자 경로 검색 API
   *
   * SK t map API를 통해 검색
   *
   * @author jochongs
   */
  @HttpCode(200)
  @LoginAuth()
  @Exception(400, 'invalid querystring')
  @Post('/pedestrian/all')
  async getPedestrianRoute(
    @Body() getPedestrianDto: GetPedestrianDto,
  ): Promise<GetPedestrianRouteResponseDto> {
    const features = await this.addressService.getPedestrian(getPedestrianDto);

    return {
      type: 'FeatureCollection',
      features,
    };
  }
}
