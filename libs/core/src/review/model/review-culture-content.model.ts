import { PickType } from '@nestjs/swagger';
import { CultureContentAuthorModel } from 'libs/core/culture-content/model/culture-content-author.model';
import { CultureContentImgModel } from 'libs/core/culture-content/model/culture-content-img.model';
import { CultureContentModel } from 'libs/core/culture-content/model/culture-content.model';
import { ReviewCultureContentSelectField } from 'libs/core/review/model/prisma/review-culture-content-select-field';
import { GenreModel } from 'libs/core/tag-root/genre/model/genre.model';

/**
 * 리뷰의 컨텐츠 필드
 *
 * @author jochongs
 */
export class ReviewCultureContentModel extends PickType(CultureContentModel, [
  'idx',
  'author',
  'title',
  'genre',
  'likeCount',
  'imgList',
]) {
  constructor(data: ReviewCultureContentModel) {
    super();
    Object.assign(this, data);
  }

  public static fromPrisma(
    content: ReviewCultureContentSelectField,
  ): ReviewCultureContentModel {
    return new ReviewCultureContentModel({
      idx: content.idx,
      title: content.title,
      likeCount: content.likeCount,
      author: CultureContentAuthorModel.fromPrisma(content.User),
      genre: GenreModel.fromPrisma(content.Genre),
      imgList: content.ContentImg.map(CultureContentImgModel.fromPrisma),
    });
  }
}
