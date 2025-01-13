export class KeywordSearchDocument {
  /**
   * 장소 ID
   */
  id: string;

  /**
   * 장소명, 업체명
   */
  place_name: string;

  /**
   * 카테고리 이름
   */
  category_name: string;

  /**
   * 주요 카테고리만 그룹핑한 카테고리 그룹 코드
   */
  category_group_code: string;

  /**
   * 주요 카테고리만 그룹핑한 카테고리 그룹명
   */
  category_group_name: string;

  /**
   * 전화번호
   */
  phone: string;

  /**
   * 전체 지번 주소
   */
  address_name: string;

  /**
   * 전체 도로명 주소
   */
  road_address_name: string;

  /**
   * X 좌표값, 경위도인 경우 longitude (경도)
   */
  x: string;

  /**
   * Y 좌표값, 경위도인 경우 latitude (위도)
   */
  y: string;

  /**
   * 장소 상세페이지 URL
   */
  place_url: string;

  /**
   * 중심좌표까지의 거리 (단위 meter)
   */
  distance: string;
}
