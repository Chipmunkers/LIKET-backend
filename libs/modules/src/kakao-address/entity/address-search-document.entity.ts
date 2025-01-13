import { KakaoAddressEntity } from 'libs/modules/kakao-address/entity/kakao-address.entity';
import { KakaoRoadAddressEntity } from 'libs/modules/kakao-address/entity/kakao-road-address.entity';

export class AddressSearchDocumentEntity {
  /**
   * 전체 지번 주소 또는 전체 도로명 주소, 입력에 따라 결정됨
   */
  address_name: string;

  /**
   * address_name의 값의 타입(Type)
   * 다음 중 하나:
   * REGION(지명)
   * ROAD(도로명)
   * REGION_ADDR(지번 주소)
   * ROAD_ADDR(도로명 주소)
   */
  address_type: 'REGION' | 'ROAD' | 'REGION_ADDR' | 'ROAD_ADDR';

  /** X좌표 */
  x: string;

  /** Y좌표 */
  y: string;

  address: KakaoAddressEntity;

  road_address: KakaoRoadAddressEntity;
}
