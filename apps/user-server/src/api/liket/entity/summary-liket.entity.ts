import { PickType } from '@nestjs/swagger';
import { LiketEntity } from './liket.entity';
import { SummaryLiketWithInclude } from './prisma-type/summary-liket-with-include';
import { SummaryLiketModel } from 'libs/core/liket/model/summary-liket.model';
import { LiketAuthorEntity } from 'apps/user-server/src/api/liket/entity/liket-author.entity';

/**
 * @author wherehows
 */
export class SummaryLiketEntity extends PickType(LiketEntity, [
  'idx',
  'cardImgPath',
  'author',
]) {
  constructor(data: SummaryLiketEntity) {
    super(data);
    Object.assign(this, data);
  }

  static createEntity(data: SummaryLiketWithInclude) {
    return new SummaryLiketEntity({
      idx: data.idx,
      cardImgPath: data.cardImgPath,
      author: data.Review.User,
    });
  }

  public static fromModel(model: SummaryLiketModel): SummaryLiketEntity {
    return new SummaryLiketEntity({
      idx: model.idx,
      author: LiketAuthorEntity.fromModel(model.author),
      cardImgPath: model.cardImgPath,
    });
  }
}
