/**
 * 공연 상태 코드
 *
 * @author jochongs
 */
export const PERFORM_STATE = {
  /**
   * 공연예정
   */
  UPCOMING: '01',

  /**
   * 공연중
   */
  ONGOING: '02',

  /**
   * 공연완료
   */
  COMPLETED: '03',
} as const;

export type PERFORM_STATE = (typeof PERFORM_STATE)[keyof typeof PERFORM_STATE];
