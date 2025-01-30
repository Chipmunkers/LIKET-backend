/**
 * @author jochongs
 */
export class DisplayFacility {
  /**
   * 일련 번호
   *
   * @example "712"
   */
  seq: string;

  /**
   * 문화예술 공간 명칭
   *
   * @example "현대 예술관"
   */
  culName: string;

  /**
   * 문화 예술 공간 구분
   *
   * @example "공공 미술관"
   */
  culGrpName: string;

  /**
   * 전화번호
   *
   * @example "02-2234-4687"
   */
  culTel: string | null;

  /**
   * 홈페이지
   */
  culHomeUrl: string;

  /**
   * 주소
   */
  culAddr: string;

  /**
   * 개관일
   *
   * @example 20100101
   */
  culOpenDay: string;

  /**
   * 약도 URL
   */
  culMapUrl: string;

  /**
   * 문화예술 정보
   */
  culCont: string;

  /**
   * 전경/구성원 이미지
   */
  culViewImg1: string;

  /**
   * x 좌표
   *
   * @example "126.95802821008974"
   */
  gpsX: string | null;

  /**
   * y 좌표
   *
   * @example "37.51766013367088"
   */
  gpsY: string | null;

  /**
   * 우편번호
   */
  zipCode: string;
}
