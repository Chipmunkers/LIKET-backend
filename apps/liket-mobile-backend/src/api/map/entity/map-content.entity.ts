import { PickType } from '@nestjs/swagger';
import { ContentEntity } from '../../culture-content/entity/content.entity';
import { ContentWithInclude } from './prisma/content-with-include';
import { TagEntity } from '../../content-tag/entity/tag.entity';
import { LocationEntity } from '../../culture-content/entity/location.entity';

export class MapContentEntity extends PickType(ContentEntity, [
  'idx',
  'title',
  'genre',
  'startDate',
  'endDate',
  'location',
  'likeState',
  'imgList',
]) {
  constructor(data: MapContentEntity) {
    super();
    Object.assign(this, data);
  }

  static createEntity(content: ContentWithInclude) {
    return new MapContentEntity({
      idx: content.idx,
      title: content.title,
      genre: TagEntity.createEntity(content.Genre),
      startDate: content.startDate,
      endDate: content.endDate,
      location: LocationEntity.createEntity(content.Location),
      likeState: !!content.ContentLike[0],
      imgList: content.ContentImg.map((file) => file.imgPath),
    });
  }
}
