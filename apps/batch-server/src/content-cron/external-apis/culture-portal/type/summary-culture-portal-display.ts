/**
 * @author jochongs
 */
export class SummaryCulturePortalDisplay {
  /**
   * 공연 전시 목록
   *
   * @example 공연/전시
   */
  serviceName: string;

  /**
   * 공연 일련번호
   *
   * @example 274673
   */
  seq: string;

  /**
   * 제목
   *
   * @example 2024 야외컨테이너전 SHOW CON
   */
  title: string;

  /**
   * 시작일
   *
   * @example "20240319"
   */
  startDate: string;

  /**
   * 종료일
   *
   * @example "20250112"
   */
  endDate: string;

  /**
   * 장소
   *
   * @example "오산시립미술관"
   */
  place: string | null;

  /**
   * 분류명
   *
   * @example "미술"
   */
  realmName: string;

  /**
   * 지역명
   *
   * @example "경기"
   */
  area: string | null;

  /**
   * 썸네일
   *
   * @example "http://www.culture.go.kr/upload/rdf/24/12/rdf_2024120621245354914.jpg"
   */
  thumbnail: string;

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
}
