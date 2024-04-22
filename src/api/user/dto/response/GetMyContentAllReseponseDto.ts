import { ValidateNested } from 'class-validator';
import { ContentEntity } from '../../../culture-content/entity/ContentEntity';

export class GetMyContentAllResponseDto {
  @ValidateNested()
  contentList: ContentEntity<'summary'>[];
  count: number;
}
