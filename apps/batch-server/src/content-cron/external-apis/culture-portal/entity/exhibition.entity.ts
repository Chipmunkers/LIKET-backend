import { CulturePortalDisplay } from 'apps/batch-server/src/content-cron/external-apis/culture-portal/type/culture-portal-display';
import { DisplayFacility } from 'apps/batch-server/src/content-cron/external-apis/culture-portal/type/display-facility';

/**
 * 문화 포털에서는 display라고하지만 batch-server에서는 exhibition으로 통일합니다.
 *
 * @author jochongs
 */
export class ExhibitionEntity {
  info: CulturePortalDisplay;
  facility: DisplayFacility;

  constructor(data: ExhibitionEntity) {
    Object.assign(this, data);
  }

  static createEntity(
    info: CulturePortalDisplay,
    facility: DisplayFacility,
  ): ExhibitionEntity {
    return new ExhibitionEntity({
      info,
      facility,
    });
  }
}
