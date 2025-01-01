import { FestivalIntroFromApi } from 'apps/batch-server/src/content-cron/external-apis/tour/type/festival-intro-from-api';

/**
 * @author jochongs
 */
export class FestivalIntroEntity {
  /**
   * 컨텐츠 ID
   */
  contentId: string;

  /**
   * 컨텐츠 타입 아이디
   */
  contentTypeId: string;

  /**
   * 주최자 정보
   */
  sponsor1: string | null;

  /**
   * 주최자 연락처
   */
  sponsor1tel: string | null;

  /**
   * 주관사 정보
   *
   * @example 경기관광공사,수원문화재단
   */
  sponsor2: string | null;

  /**
   * 주관사 연락처
   *
   * @example 031-290-3563
   */
  sponsor2tel: string | null;

  /**
   * 행사종료일
   *
   * @example 20211231
   */
  eventEndDate: string | null;

  /**
   * 공연시간
   *
   * @example 연중(밤10시이후제한)
   */
  playtime: string | null;

  /**
   * 행사장소
   *
   * @example 수원화성일원
   */
  eventPlace: string | null;

  /**
   * 행사홈페이지
   *
   * @example https://www.xxx.com
   */
  eventHomepage: string | null;

  /**
   * 관람가능연령
   *
   * @example 만 13세이상
   */
  ageLimit: string | null;

  /**
   * 예매처
   */
  bookingPlace: string | null;

  /**
   * 공연시간
   */
  placeInfo: string | null;

  /**
   * 부대행사
   */
  subEvent: string | null;

  /**
   * 행사프로그램
   */
  program: string | null;

  /**
   * 행사종료일
   */
  eventStartDate: string | null;

  /**
   * 이용요금
   */
  useTimeFestival: string | null;

  /**
   * 할인정보
   */
  discountInfoFestival: string | null;

  /**
   * 관람소요시간
   */
  spendTimeFestival: string | null;

  /**
   * 축제 등급
   */
  festivalGrade: string | null;

  constructor(data: FestivalIntroEntity) {
    Object.assign(this, data);
  }

  static createEntity(festival: FestivalIntroFromApi) {
    return new FestivalIntroEntity({
      contentId: festival.contentid,
      contentTypeId: festival.contenttypeid,
      sponsor1: festival.sponsor1 === '' ? null : festival.sponsor1,
      sponsor1tel: festival.sponsor1tel === '' ? null : festival.sponsor1tel,
      sponsor2: festival.sponsor2 === '' ? null : festival.sponsor2,
      sponsor2tel: festival.sponsor2tel === '' ? null : festival.sponsor2tel,
      eventEndDate: festival.eventenddate === '' ? null : festival.eventenddate,
      playtime: festival.playtime === '' ? null : festival.playtime,
      eventPlace: festival.eventplace === '' ? null : festival.eventplace,
      eventHomepage:
        festival.eventhomepage === '' ? null : festival.eventhomepage,
      ageLimit: festival.agelimit === '' ? null : festival.agelimit,
      bookingPlace: festival.bookingplace === '' ? null : festival.bookingplace,
      placeInfo: festival.placeinfo === '' ? null : festival.placeinfo,
      subEvent: festival.subevent === '' ? null : festival.subevent,
      program: festival.program === '' ? null : festival.program,
      eventStartDate:
        festival.eventstartdate === '' ? null : festival.eventstartdate,
      useTimeFestival:
        festival.usetimefestival === '' ? null : festival.usetimefestival,
      discountInfoFestival:
        festival.discountinfofestival === ''
          ? null
          : festival.discountinfofestival,
      spendTimeFestival:
        festival.spendtimefestival === '' ? null : festival.spendtimefestival,
      festivalGrade:
        festival.festivalgrade === '' ? null : festival.festivalgrade,
    });
  }
}
