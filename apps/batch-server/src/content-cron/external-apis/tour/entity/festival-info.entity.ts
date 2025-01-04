import { FestivalInfoFromApi } from 'apps/batch-server/src/content-cron/external-apis/tour/type/festival-info-from-api';

/**
 * @author jochongs
 */
export class FestivalInfoEntity {
  introduce: string | null;
  description: string | null;

  constructor(data: FestivalInfoEntity) {
    Object.assign(this, data);
  }

  static createEntity(
    festivalInfoList: FestivalInfoFromApi[],
  ): FestivalInfoEntity {
    return new FestivalInfoEntity({
      introduce:
        festivalInfoList.find((info) => info.infoname === '행사소개')
          ?.infotext ?? null,
      description:
        festivalInfoList.find((info) => info.infoname === '행사내용')
          ?.infotext ?? null,
    });
  }

  static createEntityWithNull() {
    return new FestivalInfoEntity({
      introduce: null,
      description: null,
    });
  }
}
