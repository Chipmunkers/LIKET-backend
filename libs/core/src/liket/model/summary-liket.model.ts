import { PickType } from '@nestjs/swagger';
import { LiketAuthorModel } from 'libs/core/liket/model/liket-author.model';
import { LiketModel } from 'libs/core/liket/model/liket.model';
import { SummaryLiketSelectField } from 'libs/core/liket/model/prisma/summary-liket-select-field';

/**
 * @author jochongs
 */
export class SummaryLiketModel extends PickType(LiketModel, [
  'idx',
  'cardImgPath',
  'author',
  'createdAt',
] as const) {
  constructor(data: SummaryLiketModel) {
    super();
    Object.assign(this, data);
  }

  public static fromPrisma(liket: SummaryLiketSelectField): SummaryLiketModel {
    return new SummaryLiketModel({
      idx: liket.idx,
      author: LiketAuthorModel.fromPrisma(liket.Review.User),
      cardImgPath: liket.cardImgPath,
      createdAt: liket.createdAt,
    });
  }
}
