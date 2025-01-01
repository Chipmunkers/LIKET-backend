import { FestivalEntity } from 'apps/batch-server/src/content-cron/external-apis/tour/entity/festival.entity';

export class GetFestivalByIdResponseDto {
  response: {
    header: {
      resultCode: string;
      resultMsg: string;
    };
    body: {
      items:
        | ''
        | (Pick<FestivalEntity, 'contentid' | 'contenttypeid'> &
            {
              serialnum: string;
              infoname: string;
              infotext: string;
              fldgubun: string;
            }[]);
    };
  };
}
