import { PickType } from '@nestjs/swagger';
import { LocationEntity } from './location.entity';
import { SelectSummaryLocationFieldPrisma } from 'apps/user-server/src/api/culture-content/entity/prisma/select-summary-location-field';

/**
 * @author jochongs
 */
export class SummaryLocationEntity extends PickType(LocationEntity, [
  'region1Depth',
  'region2Depth',
] as const) {
  constructor(data: SummaryLocationEntity) {
    super();
    Object.assign(this, data);
  }

  static createEntity(data: SelectSummaryLocationFieldPrisma) {
    return new SummaryLocationEntity({
      region1Depth: data.region1Depth,
      region2Depth: data.region2Depth,
    });
  }
}
