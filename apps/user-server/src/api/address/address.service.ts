import { Injectable } from '@nestjs/common';
import { KakaoAddressService } from 'libs/modules/kakao-address/kakao-address.service';
import { SearchAddressDto } from 'apps/user-server/src/api/address/dto/request/search-address.dto';
import { AddressEntity } from 'apps/user-server/src/api/address/entity/address.entity';

@Injectable()
export class AddressService {
  constructor(private readonly kakaoAddressService: KakaoAddressService) {}

  /**
   * @author jochongs
   */
  public async searchAddress(dto: SearchAddressDto): Promise<AddressEntity[]> {
    const result = await this.kakaoAddressService.searchAddress(dto.search);

    return result.documents.map((doc) =>
      AddressEntity.createEntity(doc.address, doc.road_address),
    );
  }
}
