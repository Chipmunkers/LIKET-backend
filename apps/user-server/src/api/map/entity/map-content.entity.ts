import { PickType } from '@nestjs/swagger';
import { ContentEntity } from '../../culture-content/entity/content.entity';
import { ContentWithInclude } from './prisma/content-with-include';
import { TagEntity } from '../../content-tag/entity/tag.entity';
import { LocationEntity } from '../../culture-content/entity/location.entity';
import { SummaryCultureContentModel } from 'libs/core/culture-content/model/summary-culture-content.model';

/**
 * @author jochongs
 */
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

  /**
   * `CoreModule`이 도입됨에 따라 deprecated 되었습니다.
   * 대신, `fromModel`을 사용하십시오.
   *
   * @deprecated
   */
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

  public static fromModel(
    content: SummaryCultureContentModel,
  ): MapContentEntity {
    return new MapContentEntity({
      idx: content.idx,
      title: content.title,
      genre: TagEntity.fromModel(content.genre),
      startDate: content.startDate,
      endDate: content.endDate,
      location: LocationEntity.fromModel(content.location),
      likeState: content.likeState,
      imgList: content.imgList.map(({ imgPath }) => imgPath),
    });
  }
}
