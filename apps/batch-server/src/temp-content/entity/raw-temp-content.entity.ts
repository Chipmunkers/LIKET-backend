import { KakaoAddressEntity } from '../../../../../libs/modules/src/kakao-address/entity/kakao-address.entity';
import { KakaoRoadAddressEntity } from '../../../../../libs/modules/src/kakao-address/entity/kakao-road-address.entity';
import { FacilityEntity } from '../../content-cron/external-apis/kopis/entity/facility.entity';
import { PerformEntity } from '../../content-cron/external-apis/kopis/entity/perform.entity';

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
