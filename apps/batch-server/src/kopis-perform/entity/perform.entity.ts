import { ArrayOrObject } from '../type/ArrayOrObject';

/**
 * 공연 상세 정보
 *
 * @author jochongs
 */
export class PerformEntity {
  /**
   * 공연 ID
   *
   * @example: "PF132236"
   */
  mt20id: string;

  /**
   * 공연시설 ID
   *
   * @example: "FC001431"
   */
  mt10id: string;

  /**
   * 공연명
   *
   * @example: "우리 연애할까"
   */
  prfnm: string;

  /**
   * 공연 시작일
   *
   * @example: "2016.05.12"
   */
  prfpdfrom: string;

  /**
   * 공연 종료일
   *
   * @example: "2016.07.31"
   */
  prfpdto: string;

  /**
   * 공연시설명 (공연장명)
   *
   * @example: "피카로아트홀(구 혼아트홀)"
   */
  fcltynm: string;

  /**
   * 공연출연진
   *
   * @example: "김부연, 임정균, 최수영"
   */
  prfcast: string | null;

  /**
   * 공연제작진
   *
   * @example: "천정민"
   */
  prfcrew: string | null;

  /**
   * 공연 런타임
   *
   * @example: "1시간 30분"
   */
  prfruntime: string;

  /**
   * 공연 관람 연령
   *
   * @example: "만 12세 이상"
   */
  prfage: string;

  /**
   * 제작사
   *
   * @example: "극단 피에로"
   */
  entrpsnmP: string | null;

  /**
   * 기획사
   *
   * @example: "기획사"
   */
  entrpsnmA: string | null;

  /**
   * 주최
   *
   * @example: "주최"
   */
  entrpsnmH: string | null;

  /**
   * 주관
   *
   * @example: "주관"
   */
  entrpsnmS: string | null;

  /**
   * 티켓가격
   *
   * @example: "전석 30,000원"
   */
  pcseguidance: string;

  /**
   * 포스터 이미지 경로
   *
   * @example: "http://www.kopis.or.kr/upload/pfmPoster/PF_PF132236_160704_142630.gif"
   */
  poster: string;

  /**
   * 즐거움 (스타일)
   *
   * @example: "즐거움"
   */
  sty: string | null;

  /**
   * 공연장르명
   *
   * @example: "연극"
   */
  genrenm: string;

  /**
   * 공연 상태
   *
   * @example: "공연중"
   */
  prfstate: string;

  /**
   * 오픈런 여부
   *
   * @example: "N"
   */
  openrun: 'N' | 'Y';

  /**
   * 방문 여부
   *
   * @example: "N"
   */
  visit: 'N' | 'Y';

  /**
   * 아동 여부
   *
   * @example: "N"
   */
  child: 'N' | 'Y';

  /**
   * 대학로 여부
   *
   * @example: "Y"
   */
  daehakro: 'N' | 'Y';

  /**
   * 축제 여부
   *
   * @example: "N"
   */
  festival: 'N' | 'Y';

  /**
   * 뮤지컬 라이선스 여부
   *
   * @example: "N"
   */
  musicallicense: 'N' | 'Y';

  /**
   * 뮤지컬 창작 여부
   *
   * @example: "N"
   */
  musicalcreate: 'N' | 'Y';

  /**
   * 최종 수정일
   *
   * @example: "2019-07-25 10:03:14"
   */
  updatedate: string;

  /**
   * 소개 이미지 목록
   */
  styurls: {
    styurl: string | string[];
  };

  /**
   * 공연 시간
   *
   * @example: "화요일~금요일(20:00), 토요일(16:00,19:00), 일요일(15:00,18:00)"
   */
  dtguidance: string;

  relates: {
    relate: ArrayOrObject<{ relatenm: string; relateurl: string }>;
  };
}
