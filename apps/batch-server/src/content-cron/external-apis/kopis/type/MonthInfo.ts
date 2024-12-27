/**
 * 공연 시작 날짜와 종료 날짜.
 * 해당 기간의 차이는 KOPIS에서 제한한 31일 차이
 *
 * @author jochongs
 */
export type MonthInfo = {
  /**
   * 공연 시작 날짜
   */
  startDate: Date;

  /**
   * 공연 종료 날짜
   */
  endDate: Date;
};
