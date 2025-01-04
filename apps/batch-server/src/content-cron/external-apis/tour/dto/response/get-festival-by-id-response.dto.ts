import { FestivalEntity } from 'apps/batch-server/src/content-cron/external-apis/tour/entity/festival.entity';
import { FestivalInfoFromApi } from 'apps/batch-server/src/content-cron/external-apis/tour/type/festival-info-from-api';

export class GetFestivalByIdResponseDto {
  response: {
    header: {
      resultCode: string;
      resultMsg: string;
    };
    body: {
      items:
        | ''
        | {
            item: FestivalInfoFromApi[];
          };
    };
  };
}
