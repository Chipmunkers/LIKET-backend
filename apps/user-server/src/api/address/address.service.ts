import { Injectable } from '@nestjs/common';
import { KakaoAddressService } from 'libs/modules/kakao-address/kakao-address.service';
import { SearchAddressDto } from 'apps/user-server/src/api/address/dto/request/search-address.dto';
import { KeywordSearchResultEntity } from 'libs/modules/kakao-address/entity/keyword-search-result.entity';
import { SkOpenApiProvider } from 'libs/modules/sk-open-api/sk-open-api.provider';
import { GetPedestrianDto } from 'apps/user-server/src/api/address/dto/request/get-pedestrian.dto';
import { PedestrianRouteEntity } from 'apps/user-server/src/api/address/entity/pedestrian-route.entity';

@Injectable()
export class AddressService {
  constructor(
    private readonly kakaoAddressService: KakaoAddressService,
    private readonly skOpenApiProvider: SkOpenApiProvider,
  ) {}

  /**
   * @author jochongs
   */
  public async searchKeyword(
    dto: SearchAddressDto,
  ): Promise<KeywordSearchResultEntity> {
    return await this.kakaoAddressService.searchKeyword(dto.search);
  }

  /**
   * @author jochongs
   */
  public async getPedestrian(
    dto: GetPedestrianDto,
  ): Promise<PedestrianRouteEntity[]> {
    const result = await this.skOpenApiProvider.getPedestrianRoutes({
      startName: dto.startName,
      startX: dto.startX,
      startY: dto.startY,
      endName: dto.endName,
      endX: dto.endX,
      endY: dto.endY,
      passList: dto.stopoverList,
    });

    if (result === '') {
      return [];
    }

    return result.features.map((feature) =>
      PedestrianRouteEntity.createEntity(feature),
    );
  }
}
