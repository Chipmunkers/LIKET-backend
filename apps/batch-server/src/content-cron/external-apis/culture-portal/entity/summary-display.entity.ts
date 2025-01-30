import { CulturePortalDisplay } from 'apps/batch-server/src/content-cron/external-apis/culture-portal/type/culture-portal-display';
import { SummaryCulturePortalDisplay } from 'apps/batch-server/src/content-cron/external-apis/culture-portal/type/summary-culture-portal-display';

/**
 * @author jochongs
 */
export class SummaryExhibitionEntity extends SummaryCulturePortalDisplay {
  constructor(data: SummaryExhibitionEntity) {
    super();
    Object.assign(this, data);
  }

  static createEntity(
    exhibition: SummaryCulturePortalDisplay,
  ): SummaryExhibitionEntity {
    return new SummaryExhibitionEntity(exhibition);
  }
}
