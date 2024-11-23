import { PickType } from '@nestjs/swagger';
import { Location } from '@prisma/client';
import { LocationEntity } from './location.entity';

export class SummaryLocationEntity extends PickType(LocationEntity, [
  'region1Depth',
  'region2Depth',
] as const) {
  constructor(data: SummaryLocationEntity) {
    super();
    Object.assign(this, data);
  }

  static createEntity(data: Location) {
    return new SummaryLocationEntity({
      region1Depth: data.region1Depth,
      region2Depth: data.region2Depth,
    });
  }
}
