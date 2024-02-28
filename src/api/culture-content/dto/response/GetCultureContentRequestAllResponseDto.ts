import { ContentEntity } from '../../entity/ContentEntity';

export class GetCultureContentRequestAllResponseDto {
  /**
   * Culture-content list
   */
  contentList: ContentEntity<'summary', 'admin'>[];

  /**
   * Total count of culture-content
   */
  count: number;
}
