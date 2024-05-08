import { SummaryContentEntity } from '../../../culture-content/entity/summary-content.entity';

export class GetMyContentAllResponseDto {
  public contentList: SummaryContentEntity[];

  /**
   * 검색된 컨텐츠 개수
   *
   * @example 1
   */
  public count: number;
}
