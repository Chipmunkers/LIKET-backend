export type FindNoticeOrderByInput = {
  by: 'idx' | 'pin' | 'activated';
  order: 'desc' | 'asc';
};

/**
 * @author jochongs
 */
export class FindNoticeAllInput {
  /** 페이지네이션 번호 (1부터 시작) */
  public readonly page: number;

  /** 한 번에 가져올 데이터 */
  public readonly row: number;

  /** 검색어 */
  public readonly search?: string;

  /**
   * 상태 필터링
   *
   * active - 활성화된 공지사항
   * deactivate - 비활성화된 공지사항
   * pin - 고정된 공지사항
   */
  public readonly stateList?: ('active' | 'deactivate' | 'pin')[];

  /**
   * 정렬 순서
   *
   * idx - 생성순
   * pin - 고정된 시간순
   */
  public readonly orderByList?: FindNoticeOrderByInput[];
}
