import { FestivalIntroEntity } from 'apps/batch-server/src/content-cron/external-apis/tour/entity/festival-intro.entity';
import { FestivalIntroFromApi } from 'apps/batch-server/src/content-cron/external-apis/tour/type/festival-intro-from-api';

/**
 * @author jochongs
 */
export class GetFestivalIntroByIdResponseDto {
  response: {
    header: {
      resultCode: string;
      resultMsg: string;
    };
    body: {
      items:
        | ''
        | {
            item: FestivalIntroFromApi[];
          };
    };
  };
}
