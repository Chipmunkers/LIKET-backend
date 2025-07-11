import { TagEntity } from '../../content-tag/entity/tag.entity';
import { LocationEntity } from './location.entity';
import { PickType } from '@nestjs/swagger';
import { ContentEntity } from './content.entity';
import { SelectSummaryContentFieldPrisma } from 'apps/user-server/src/api/culture-content/entity/prisma/select-summary-content-field';
import { SelectLikedContentFieldPrisma } from 'apps/user-server/src/api/culture-content/entity/prisma/select-liked-content-field';
import { SummaryCultureContentModel } from 'libs/core/culture-content/model/summary-culture-content.model';

/**
 * @author jochongs
 */
export class SummaryContentEntity extends PickType(ContentEntity, [
  'idx',
  'title',
  'thumbnail',
  'genre',
  'style',
  'age',
  'location',
  'startDate',
  'endDate',
  'likeState',
  'createdAt',
  'acceptedAt',
]) {
  constructor(content: SummaryContentEntity) {
    super();
    Object.assign(this, content);
  }

  /**
   * `CultureContentCoreModule`이 만들어짐에따라 deprecated 되었습니다.
   * 대신 fromModel 정적 메서드를 사용하십시오.
   *
   * @deprecated
   */
  static createEntity(data: SelectSummaryContentFieldPrisma) {
    return new SummaryContentEntity({
      idx: data.idx,
      title: data.title,
      thumbnail: data.ContentImg[0]?.imgPath || '',
      genre: TagEntity.createEntity(data.Genre),
      style: data.Style.map((style) => TagEntity.createEntity(style.Style)),
      age: TagEntity.createEntity(data.Age),
      location: LocationEntity.createEntity(data.Location),
      startDate: data.startDate,
      endDate: data.endDate,
      likeState: data.ContentLike[0] ? true : false,
      createdAt: data.createdAt,
      acceptedAt: data.acceptedAt,
    });
  }

  /**
   * `CultureContentCoreModule`이 만들어짐에따라 deprecated 되었습니다.
   * 대신 fromModel 정적 메서드를 사용하십시오.
   *
   * @deprecated
   */
  static fromLikeContent(data: SelectLikedContentFieldPrisma) {
    const content = data.CultureContent;

    return new SummaryContentEntity({
      idx: content.idx,
      title: content.title,
      thumbnail: content.ContentImg[0]?.imgPath || '',
      genre: TagEntity.createEntity(content.Genre),
      style: content.Style.map((style) => TagEntity.createEntity(style.Style)),
      age: TagEntity.createEntity(content.Age),
      location: LocationEntity.createEntity(content.Location),
      startDate: content.startDate,
      endDate: content.endDate,
      likeState: true,
      createdAt: content.createdAt,
      acceptedAt: content.acceptedAt,
    });
  }

  public static fromModel(
    model: SummaryCultureContentModel,
  ): SummaryContentEntity {
    return new SummaryContentEntity({
      idx: model.idx,
      title: model.title,
      thumbnail: model.imgList[0].imgPath || '',
      genre: TagEntity.fromModel(model.genre),
      style: model.styleList.map(TagEntity.fromModel),
      age: TagEntity.fromModel(model.age),
      location: LocationEntity.fromModel(model.location),
      startDate: model.startDate,
      endDate: model.endDate,
      likeState: model.likeState,
      createdAt: model.createdAt,
      acceptedAt: model.acceptedAt,
    });
  }
}
