/**
 * @author jochongs
 */
export type ExecuteWithRetryOption = {
  /**
   * 재시도 횟수
   *
   * @default 1
   */
  readonly retry?: number;

  /**
   * 실패했을 경우 다시 시도할 때 까지의 걸리는 시간
   * 단위: (ms)
   *
   * @default 0
   */
  delay?: number;
};
