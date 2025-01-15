import { PerformEntity } from '../../entity/perform.entity';

export class GetPerformByIdResponseDto {
  dbs: null | {
    db: PerformEntity;
  };
}
