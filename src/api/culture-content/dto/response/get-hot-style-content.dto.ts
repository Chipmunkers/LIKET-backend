import { TagEntity } from '../../../content-tag/entity/tag.entity';
import { SummaryContentEntity } from '../../../culture-content/entity/summary-content.entity';

export class GetHotContentResponseDto {
  contentList: SummaryContentEntity[];
  style: TagEntity;
}
