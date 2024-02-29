import { ContentEntity } from '../../../culture-content/entity/ContentEntity';

export class GetMyContentAllResponseDto {
  contentList: ContentEntity<'summary', 'admin'>[];
  count: number;
}
