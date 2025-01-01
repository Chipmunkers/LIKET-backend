/**
 * @author jochongs
 */
export class FestivalIntroFromApi {
  /**
   * 컨텐츠 ID
   */
  contentid: string;

  /**
   * 컨텐츠 타입 아이디
   */
  contenttypeid: string;

  /**
   * 주최자 정보
   */
  sponsor1: string;

  /**
   * 주최자 연락처
   */
  sponsor1tel: string;

  /**
   * 주관사 정보
   *
   * @example 경기관광공사,수원문화재단
   */
  sponsor2: string;

  /**
   * 주관사 연락처
   *
   * @example 031-290-3563
   */
  sponsor2tel: string;

  /**
   * 행사종료일
   *
   * @example 20211231
   */
  eventenddate: string;

  /**
   * 공연시간
   *
   * @example 연중(밤10시이후제한)
   */
  playtime: string;

  /**
   * 행사장소
   *
   * @example 수원화성일원
   */
  eventplace: string;

  /**
   * 행사홈페이지
   *
   * @example https://www.xxx.com
   */
  eventhomepage: string;

  /**
   * 관람가능연령
   *
   * @example 만 13세이상
   */
  agelimit: string;

  /**
   * 예매처
   */
  bookingplace: string;

  /**
   * 공연시간
   */
  placeinfo: string;

  /**
   * 부대행사
   */
  subevent: string;

  /**
   * 행사프로그램
   */
  program: string;

  /**
   * 행사종료일
   */
  eventstartdate: string;

  /**
   * 이용요금
   */
  usetimefestival: string;

  /**
   * 할인정보
   */
  discountinfofestival: string;

  /**
   * 관람소요시간
   */
  spendtimefestival: string;

  /**
   * 축제등급
   */
  festivalgrade: string;
}
