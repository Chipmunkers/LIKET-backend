import { Genre } from 'libs/core/tag-root/genre/constant/genre';

/**
 * @author jochongs
 */
export class FindLikedCultureContentAllInput {
  /**
   * 페이지 (1부터 시작)
   */
  public readonly page: number;

  /**
   * 한 번에 불러올 데이터 개수
   */
  public readonly row: number;

  /**
   * 정렬할 요소
   *
   * @author jochongs
   *
   * like - 좋아요 누른 시점 기준
   * create - 컨텐츠가 생성된 시점 기준
   * accept - 컨텐츠가 수락된 시점 기준
   *
   * @default "like"
   */
  public readonly orderBy?: 'create' | 'like' | 'accept';

  /**
   * 정렬 방식
   *
   * @author jochongs
   *
   * @default "desc"
   */
  public readonly order?: 'desc' | 'asc';

  /**
   * 활성화 컨텐츠 필터링
   *
   * true: 활성화된 컨텐츠만 가져옴
   * false: 비활성화된 컨텐츠만 가져옴
   */
  public readonly accept: boolean;

  /**
   * 컨텐츠 오픈 상태 필터링
   *
   * soon-open: 오픈 예정인 컨텐츠 필터링
   * continue: 진행중인 컨텐츠 필터링
   * end: 종료된 컨텐츠 필터링
   *
   * @default []
   */
  public readonly open?: ('soon-open' | 'continue' | 'end')[];

  /**
   * 장르 필터링
   *
   * @default []
   */
  public readonly genre?: Genre[];
}
