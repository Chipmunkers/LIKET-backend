import { PickType } from '@nestjs/swagger';
import { CulturePortalDisplay } from 'apps/batch-server/src/content-cron/external-apis/culture-portal/type/culture-portal-display';

/**
 * @author jochongs
 */
export class SummaryCulturePortalDisplay extends PickType(
  CulturePortalDisplay,
  [
    'title',
    'seq',
    'startDate',
    'endDate',
    'place',
    'realmName',
    'area',
    'gpsX',
    'gpsY',
  ],
) {
  /**
   * 공연 전시 목록
   *
   * @example 공연/전시
   */
  serviceName: string;

  /**
   * 썸네일
   *
   * @example "http://www.culture.go.kr/upload/rdf/24/12/rdf_2024120621245354914.jpg"
   */
  thumbnail: string;
}
