import { PickType } from '@nestjs/swagger';
import { CultureContentAuthorModel } from 'libs/core/culture-content/model/culture-content-author.model';
import { CultureContentImgModel } from 'libs/core/culture-content/model/culture-content-img.model';
import { CultureContentLocationModel } from 'libs/core/culture-content/model/culture-content-location.model';
import { CultureContentModel } from 'libs/core/culture-content/model/culture-content.model';
import { LikedCultureContentSelectField } from 'libs/core/culture-content/model/prisma/liked-culture-content-select-field';
import { SummaryCultureContentSelectField } from 'libs/core/culture-content/model/prisma/summary-culture-content-select-field';
import { AgeModel } from 'libs/core/tag-root/age/model/age.model';
import { GenreModel } from 'libs/core/tag-root/genre/model/genre.model';
import { StyleModel } from 'libs/core/tag-root/style/model/style.model';

/**
 * @author jochongs
 */
export class SummaryCultureContentModel extends PickType(CultureContentModel, [
  'idx',
  'genre',
  'age',
  'styleList',
  'author',
  'location',
  'imgList',
  'id',
  'title',
  'startDate',
  'endDate',
  'viewCount',
  'openTime',
  'likeCount',
  'likeState',
  'createdAt',
  'acceptedAt',
]) {
  constructor(data: SummaryCultureContentModel) {
    super();
    Object.assign(this, data);
  }

  public static fromPrisma(
    content: SummaryCultureContentSelectField,
  ): SummaryCultureContentModel {
    return new SummaryCultureContentModel({
      idx: content.idx,
      genre: GenreModel.fromPrisma(content.Genre),
      age: AgeModel.fromPrisma(content.Age),
      styleList: content.Style.map((style) =>
        StyleModel.fromPrisma(style.Style),
      ),
      author: CultureContentAuthorModel.fromPrisma(content.User),
      location: CultureContentLocationModel.fromPrisma(content.Location),
      imgList: content.ContentImg.map(CultureContentImgModel.fromPrisma),
      id: content.id,
      title: content.title,
      startDate: content.startDate,
      endDate: content.endDate,
      viewCount: content.viewCount,
      openTime: content.openTime,
      likeCount: content.likeCount,
      likeState: !!content.ContentLike[0],
      createdAt: content.createdAt,
      acceptedAt: content.acceptedAt,
    });
  }

  public static fromLiked({
    CultureContent: content,
  }: LikedCultureContentSelectField): SummaryCultureContentModel {
    return new SummaryCultureContentModel({
      idx: content.idx,
      genre: GenreModel.fromPrisma(content.Genre),
      age: AgeModel.fromPrisma(content.Age),
      styleList: content.Style.map((style) =>
        StyleModel.fromPrisma(style.Style),
      ),
      author: CultureContentAuthorModel.fromPrisma(content.User),
      location: CultureContentLocationModel.fromPrisma(content.Location),
      imgList: content.ContentImg.map(CultureContentImgModel.fromPrisma),
      id: content.id,
      title: content.title,
      startDate: content.startDate,
      endDate: content.endDate,
      viewCount: content.viewCount,
      openTime: content.openTime,
      likeCount: content.likeCount,
      likeState: true,
      createdAt: content.createdAt,
      acceptedAt: content.acceptedAt,
    });
  }
}
