import { InquiryType } from 'libs/core/inquiry/constant/inquiry-type';

/**
 * @author jochongs
 */
export class FindInquiryAllInput {
  /** 페이지네이션 번호 (1부터 시작) */
  public readonly page: number;

  /** 한 번에 가져올 데이터 개수 */
  public readonly row: number;

  /**
   * 검색 방식
   *
   * - title: 문의 제목으로 검색
   * - nickname: 문의 작성자로 검색
   */
  public readonly searchBy?: 'title' | 'nickname';

  /**
   * 검색어
   */
  public readonly search?: string;

  /**
   * 문의 유형 필터링
   */
  public readonly typeIdx?: InquiryType;

  /**
   * 답변 상태 필터링
   */
  public readonly answerState?: boolean;

  /**
   * 작성자 필터링
   */
  public readonly user?: number;

  /**
   * 문의 order by
   *
   * @default "idx"
   */
  public readonly orderBy?: 'idx';

  /**
   * 문의 방식
   *
   * @default "desc"
   */
  public readonly order?: 'asc' | 'desc';
}
