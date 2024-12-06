import { KakaoAddressEntity } from '../../kakao-address/entity/kakao-address.entity';
import { KakaoRoadAddressEntity } from '../../kakao-address/entity/kakao-road-address.entity';
import { FacilityEntity } from '../../kopis-perform/entity/facility.entity';
import { PerformEntity } from '../../kopis-perform/entity/perform.entity';

export class RawTempContentEntity {
  perform: PerformEntity;
  facility: FacilityEntity;
  address: KakaoAddressEntity;
  roadAddress: KakaoRoadAddressEntity;
}
