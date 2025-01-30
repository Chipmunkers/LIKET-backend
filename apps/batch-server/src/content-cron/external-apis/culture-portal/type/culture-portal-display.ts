import { PickType } from '@nestjs/swagger';
import { SummaryCulturePortalDisplay } from 'apps/batch-server/src/content-cron/external-apis/culture-portal/type/summary-culture-portal-display';

/**
 * @author jochongs
 */
export class CulturePortalDisplay {
  /**
   * 공연 일련번호
   *
   * @example 274673
   */
  seq: string;

  /**
   * 장소
   *
   * @example "오산시립미술관"
   */
  place: string | null;

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
  endDate: string | null;

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
   * 컨텐츠 설명 (HTML 형식이 많이 포함되어있음)
   */
  content1: string | null;

  /**
   * 가격
   *
   * !주의: 무료인 경우 "무료" 텍스트가 포함되어있는지 확인해야 함
   */
  price: string;

  /**
   * 전시회 URL
   */
  url: string | null;

  /**
   * !주의: 이미지 url이 존재하지 않을 수도 있습니다.
   */
  imgUrl: string | null;

  /**
   * 핸드폰 번호
   */
  phone: string | null;

  /**
   * 장소 url
   */
  placeUrl: string | null;

  /**
   * 장소 주소
   *
   * ! 단순 텍스트이기 때문에 믿을 것이 되지 못함.
   */
  placeAddr: string | null;
  /**
   * 장소 일련 번호
   *
   * !주의: 0으로 줄 때가 있는데 0이 Null을 의미하는지 확인해봐야함
   */
  placeSeq: '0' | string | null;
}
