import { KakaoAddressEntity } from '../../kakao-address/entity/address.entity';
import { KakaoRoadAddressEntity } from '../../kakao-address/entity/road-address.entity';
import { FacilityEntity } from '../../kopis-perform/entity/facility.entity';
import { PerformEntity } from '../../kopis-perform/entity/perform.entity';

/**
 * API로부터 받은 그대로를 보관하는 Entity입니다.
 *
 * @author jochongs
 */
export class RawTempContentEntity {
  perform: PerformEntity;
  facility: FacilityEntity;
  address: KakaoAddressEntity;
  roadAddress: KakaoRoadAddressEntity;
}
