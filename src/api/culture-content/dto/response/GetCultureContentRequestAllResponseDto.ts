import { ValidateNested } from 'class-validator';
import { ContentEntity } from '../../entity/ContentEntity';

export class GetCultureContentRequestAllResponseDto {
  /**
   * Culture-content list
   */
  @ValidateNested()
  contentList: ContentEntity<'summary', 'admin'>[];

  /**
   * Total count of culture-content
   */
  count: number;
}
