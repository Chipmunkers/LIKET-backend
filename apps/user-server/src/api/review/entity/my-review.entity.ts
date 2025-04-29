import { PickType } from '@nestjs/swagger';
import { ReviewEntity } from './review.entity';
import { MyReviewWithInclude } from './prisma-type/my-review-with-include';
import { TagEntity } from '../../content-tag/entity/tag.entity';

/**
 * ReviewEntity를 사용하기로하여 deprecated되었습니다.
 * ReviewEntity를 사용하십시오.
 *
 * @author jochongs
 *
 * @deprecated
 */
export class MyReviewEntity extends PickType(ReviewEntity, [
  'idx',
  'thumbnail',
  'cultureContent',
]) {
  constructor(data: MyReviewEntity) {
    super(data);
    Object.assign(this, data);
  }

  static createEntity(data: MyReviewWithInclude) {
    return new MyReviewEntity({
      idx: data.idx,
      thumbnail: data.ReviewImg[0]?.imgPath || null,
      cultureContent: {
        idx: data.CultureContent.idx,
        genre: TagEntity.createEntity(data.CultureContent.Genre),
        title: data.CultureContent.title,
        likeCount: data.CultureContent.likeCount,
        thumbnail: data.CultureContent.ContentImg[0]?.imgPath,
      },
    });
  }
}
