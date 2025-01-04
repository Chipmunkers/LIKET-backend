import { PickType } from '@nestjs/swagger';
import { FestivalEntity } from 'apps/batch-server/src/content-cron/external-apis/tour/entity/festival.entity';
import { FestivalFromApi } from 'apps/batch-server/src/content-cron/external-apis/tour/type/festival-from-api';

/**
 * @author jochongs
 */
export class SummaryFestivalEntity extends PickType(FestivalEntity, [
  'mapX',
  'mapY',
  'mapLevel',
  'modifiedTime',
  'showFlag',
  'siGunGuCode',
  'tel',
  'title',
  'addr1',
  'addr2',
  'areaCode',
  'bookTour',
  'cat1',
  'cat2',
  'cat3',
  'contentId',
  'contentTypeId',
  'createdTime',
  'posterOrigin',
  'posterSmall',
  'zipCode',
]) {
  constructor(data: SummaryFestivalEntity) {
    super();
    Object.assign(this, data);
  }

  static createEntity(festival: FestivalFromApi) {
    return new SummaryFestivalEntity({
      mapX: festival.mapx,
      mapY: festival.mapy,
      mapLevel: festival.mlevel === '' ? null : festival.mlevel,
      modifiedTime: festival.modifiedtime,
      showFlag: festival.showflag === '1' ? '1' : '0',
      siGunGuCode: festival.sigungucode,
      tel: festival.tel === '' ? null : festival.tel,
      title: festival.title,
      addr1: festival.addr1,
      addr2: festival.addr2 === '' ? null : festival.addr2,
      areaCode: festival.areacode,
      bookTour:
        festival.booktour === '' ? null : festival.booktour === '1' ? '1' : '0',
      cat1: festival.cat1 === '' ? null : festival.cat1,
      cat2: festival.cat2 === '' ? null : festival.cat2,
      cat3: festival.cat3 === '' ? null : festival.cat3,
      contentId: festival.contentid,
      contentTypeId: festival.contenttypeid,
      createdTime: festival.createdtime,
      posterOrigin: festival.firstimage,
      posterSmall: festival.firstimage2,
      zipCode: festival.zipcode,
    });
  }
}
