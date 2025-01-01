import { SummaryFestivalEntity } from 'apps/batch-server/src/content-cron/external-apis/tour/entity/summary-festival.entity';
import { FestivalFromApi } from 'apps/batch-server/src/content-cron/external-apis/tour/type/festival-from-api';

/**
 * @author jochongs
 */
export class GetFestivalAllResponseDto {
  response: {
    header: {
      resultCode: string;
      resultMsg: string;
    };
    body: {
      items:
        | ''
        | {
            item: FestivalFromApi[];
          };
    };
  };
}
