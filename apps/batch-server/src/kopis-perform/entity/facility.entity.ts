/**
 * 공연 시설 엔티티
 *
 * @author jochongs
 */
export class FacilityEntity {
  /**
   * 공연시설명
   *
   * @example 올림픽공원
   */
  fcltynm: string;

  /**
   * 공연시설ID
   *
   * @example FC001247
   */
  mt10id: string;

  /**
   * 공연장 수
   *
   * @example 9
   */
  mt13cnt: string;

  /**
   * 시설특성
   *
   * @example 기타(공공)
   */
  fcltychartr: string;

  /**
   * 개관년도
   *
   * @example 1986
   */
  opende: string | null;

  /**
   * 객석 수
   *
   * @example 32349
   */
  seatscale: string;

  /**
   * 전화번호
   *
   * @example 02-410-1114
   */
  telno: string | null;

  /**
   * 홈페이지
   *
   * @example http://www.olympicpark.co.kr/
   */
  relateurl: string | null;

  /**
   * 주소
   *
   * @example 서울특별시 송파구 올림픽로 424 올림픽공원 (방이동)
   */
  adres: string;

  /**
   * 위도
   *
   * @example "37.52112"
   */
  la: string;

  /**
   * 경도
   *
   * @example "127.12836360000005"
   */
  lo: string;

  /**
   * 레스토랑
   *
   * @example Y
   */
  restaurant: 'N' | 'Y';

  /**
   * 카페
   *
   * @example Y
   */
  cafe: 'N' | 'Y';

  /**
   * 편의점
   *
   * @example Y
   */
  store: 'N' | 'Y';

  /**
   * 놀이터
   *
   * @example N
   */
  nolibang: 'N' | 'Y';

  /**
   * 수유실
   *
   * @example N
   */
  suyu: 'N' | 'Y';

  /**
   * 장애시설 - 주차장
   *
   * @example N
   */
  parkbarrier: 'N' | 'Y';

  /**
   * 장애시설 - 광장
   *
   * @example N
   */
  restbarrier: 'N' | 'Y';

  /**
   * 장애시설 - 화장실
   *
   * @example N
   */
  runbarrier: 'N' | 'Y';

  /**
   * 장애시설 - 엘리베이터
   *
   * @example N
   */
  elevbarrier: 'N' | 'Y';

  /**
   * 주차시설
   *
   * @example Y
   */
  parkinglot: 'N' | 'Y';

  /**
   * 공연장명
   *
   * @example KSPO DOME (체조경기장)
   */
  prfplcnm: string;

  mt13s: {
    /**
     * 공연시설 세부 ID
     *
     * @example MT13_ID(공연시설ID)
     */
    mt13id: string;

    /**
     * 좌석규모
     *
     * @example 15,000
     */
    seatscale: string;

    /**
     * 무대시설 - 오케스트라피트
     *
     * @example Y/N/Z/0
     */
    stageorchart: 'N' | 'Y';

    /**
     * 무대시설 - 연습실
     *
     * @example Y
     */
    stagepracat: 'N' | 'Y';

    /**
     * 무대시설 - 방송실
     *
     * @example Y
     */
    stagedrest: 'N' | 'Y';

    /**
     * 무대시설 - 예정공장
     *
     * @example N
     */
    stageoutrdat: 'N' | 'Y';

    /**
     * 장애인시설 - 관객석
     *
     * @example 20
     */
    disabledseatscale: string | null;

    /**
     * 무대시설 - 무대면적
     *
     * @example 15.8X13.3X8.7
     */
    stagearea: string | null;
  }[];
}
