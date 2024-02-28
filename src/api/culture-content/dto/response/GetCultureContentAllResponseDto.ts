import { ValidateNested } from 'class-validator';
import { ContentEntity } from '../../entity/ContentEntity';

export class GetCultureContentAllResponseDto {
  @ValidateNested()
  contentList: ContentEntity<'summary', 'user'>[];

  count: number;
}
