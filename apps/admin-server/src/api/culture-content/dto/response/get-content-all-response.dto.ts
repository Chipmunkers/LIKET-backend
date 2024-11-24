import { SummaryContentEntity } from '../../entity/summary-content.entity';

export class GetContentAllResponseDto {
  contentList: SummaryContentEntity[];

  /**
   * 검색된 문화생활컨텐츠 개수
   *
   * @example 83
   */
  count: number;
}
