import { ValidateNested } from 'class-validator';
import { SummaryContentEntity } from '../../entity/summary-content.entity';

export class GetCultureContentAllResponseDto {
  contentList: SummaryContentEntity[];

  count: number;
}
