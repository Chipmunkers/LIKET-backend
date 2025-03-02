import { PickType } from '@nestjs/swagger';
import { TagEntity } from 'apps/user-server/src/api/content-tag/entity/tag.entity';
import { ContentEntity } from 'apps/user-server/src/api/culture-content/entity/content.entity';
import { ReviewCultureContentModel } from 'libs/core/review/model/review-culture-content.model';

/**
 * @author jochongs
 */
export class ReviewCultureContentEntity extends PickType(ContentEntity, [
  'idx',
  'title',
  'genre',
  'likeCount',
  'thumbnail',
]) {
  constructor(data: ReviewCultureContentEntity) {
    super();
    Object.assign(this, data);
  }

  public static fromModel(
    model: ReviewCultureContentModel,
  ): ReviewCultureContentEntity {
    return new ReviewCultureContentEntity({
      idx: model.idx,
      title: model.title,
      genre: TagEntity.fromModel(model.genre),
      likeCount: model.likeCount,
      thumbnail: model.imgList[0]?.imgPath || '',
    });
  }
}
