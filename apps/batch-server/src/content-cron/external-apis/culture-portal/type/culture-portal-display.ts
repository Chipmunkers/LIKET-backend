import { PickType } from '@nestjs/swagger';
import { SummaryCulturePortalDisplay } from 'apps/batch-server/src/content-cron/external-apis/culture-portal/type/summary-culture-portal-display';

/**
 * @author jochongs
 */
export class CulturePortalDisplay extends PickType(
  SummaryCulturePortalDisplay,
  [
    'seq',
    'title',
    'startDate',
    'endDate',
    'place',
    'realmName',
    'area',
    'gpsX',
    'gpsY',
  ],
) {
  content1: string;
  price: '무료' | string;
  url: string | null;
  imgUrl: string;
  phone: string | null;
  placeUrl: string | null;
  placeAddr: string | null;
  /**
   * 장소 일련 번호
   *
   * !주의: 0으로 줄 때가 있는데 0이 Null을 의미하는지 확인해봐야함
   */
  placeSeq: '0' | string | null;
}
