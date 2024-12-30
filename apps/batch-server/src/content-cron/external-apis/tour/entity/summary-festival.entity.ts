import { PickType } from '@nestjs/swagger';
import { FestivalEntity } from 'apps/batch-server/src/content-cron/external-apis/tour/entity/festival.entity';

/**
 * @author jochongs
 */
export class SummaryFestivalEntity extends PickType(FestivalEntity, [
  'mapx',
  'mapy',
  'mlevel',
  'modifiedtime',
  'showflag',
  'sigungucode',
  'tel',
  'title',
  'addr1',
  'addr2',
  'areacode',
  'booktour',
  'cat1',
  'cat2',
  'cat3',
  'contentid',
  'contenttypeid',
  'createdtime',
  'cpyrhtDivCd',
  'firstimage',
  'firstimage2',
]) {}
