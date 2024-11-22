import { PickType } from '@nestjs/swagger';
import { LiketEntity } from './liket.entity';
import { SummaryLiketWithInclude } from './prisma-type/summary-liket-with-include';

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
}
