/**
 * @author jochongs
 */
export class FindCultureContentAllInput {
  /**
   * 정보를 불러오는 사용자의 인덱스
   */
  readUser?: number;

  /**
   * 활성화 컨텐츠 여부
   *
   * true: 활성화된 컨텐츠만 가져옴
   * false: 비활성화된 컨텐츠만 가져옴
   * undefined: 모든 컨텐츠를 가져옴
   */
  accept?: boolean;
}
