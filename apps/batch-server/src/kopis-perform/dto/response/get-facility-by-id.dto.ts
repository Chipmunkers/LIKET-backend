import { FacilityEntity } from '../../entity/facility.entity';

export class GetFacilityByIdDto {
  dbs: {
    db: FacilityEntity;
  };
}
