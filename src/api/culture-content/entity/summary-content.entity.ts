import { TagEntity } from '../../content-tag/entity/tag.entity';
import { LocationEntity } from './location.entity';
import { PickType } from '@nestjs/swagger';
import { ContentEntity } from './content.entity';
import { CotnentWithInclude } from './prisma-type/content-with-include';

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
  constructor(data: SummaryContentEntity) {
    super();
    Object.assign(this, data);
  }

  static createEntity(data: CotnentWithInclude) {
    return new SummaryContentEntity({
      idx: data.idx,
      title: data.title,
      thumbnail: data.ContentImg[0]?.imgPath || null,
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
}
