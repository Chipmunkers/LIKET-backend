import { SummaryPerformEntity } from '../../entity/summary-perform.entity';

/**
 * @author jochongs
 */
export class GetPerformAllResponseDto {
  dbs: {
    db: SummaryPerformEntity[];
  };
}
