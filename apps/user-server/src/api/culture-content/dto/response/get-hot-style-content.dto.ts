import { TagEntity } from '../../../content-tag/entity/tag.entity';
import { SummaryContentEntity } from '../../entity/summary-content.entity';

/**
 * @author jochongs
 */
export class GetHotContentResponseDto {
  contentList: SummaryContentEntity[];
  style: TagEntity;
}
