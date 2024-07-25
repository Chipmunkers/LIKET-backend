import { SummaryContentEntity } from '../../../culture-content/entity/summary-content.entity';
import { TagEntity } from '../../entity/tag.entity';

export class GetHotContentResponseDto {
  contentList: SummaryContentEntity[];
  style: TagEntity;
}
