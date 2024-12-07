import { KakaoAddressEntity } from '../../entity/address.entity';
import { KakaoRoadAddressEntity } from '../../entity/road-address.entity';

export class SearchAddressResponseDto {
  /**
   * 검색 메타 데이터
   */
  meta: {
    /** 검색어에 검색된 문서 수 */
    total_count: number;
    /** total_count 중 노출 가능 문서 수 */
    pageable_count: number;
    /** 현재 페이지가 마지막 페이지인지 여부 */
    is_end: boolean;
  };

  /**
   * 검색된 데이터들
   */
  documents: {
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
  }[];
}
