import { PerformEntity } from '../../entity/perform.entity';

export class GetPerformByIdResponseDto {
  dbs: {
    db: PerformEntity;
  };
}
