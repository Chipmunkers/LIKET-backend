import { TagEntity } from '../../content-tag/entity/tag.entity';
import { LocationEntity } from './location.entity';
import { PickType } from '@nestjs/swagger';
import { ContentEntity } from './content.entity';
import { LikeContentWithInclude } from './prisma-type/like-content-with-include';
import { SelectSummaryContentFieldPrisma } from 'apps/user-server/src/api/culture-content/entity/prisma/select-summary-content-field';

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

  static fromLikeContent(data: LikeContentWithInclude) {
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
}
