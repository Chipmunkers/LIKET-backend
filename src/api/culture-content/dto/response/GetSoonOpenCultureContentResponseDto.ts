import { ContentEntity } from '../../entity/ContentEntity';

export class GetSoonOpenCultureContentResponseDto {
  contentList: ContentEntity<'summary'>[];
}
