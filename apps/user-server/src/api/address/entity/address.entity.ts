import { SearchAddressResponseDto } from 'libs/modules/kakao-address/dto/response/serach-address.dto';
import { KakaoAddressEntity } from 'libs/modules/kakao-address/entity/kakao-address.entity';
import { KakaoRoadAddressEntity } from 'libs/modules/kakao-address/entity/kakao-road-address.entity';

export class AddressEntity {
  address: KakaoAddressEntity;

  roadAddress: KakaoRoadAddressEntity;

  constructor(data: AddressEntity) {
    Object.assign(this, data);
  }

  static createEntity(
    address: KakaoAddressEntity,
    roadAddress: KakaoRoadAddressEntity,
  ) {
    return new AddressEntity({
      address,
      roadAddress,
    });
  }
}
