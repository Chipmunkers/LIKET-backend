import { PickType } from '@nestjs/swagger';
import { ContentEntity } from 'apps/admin-server/src/api/culture-content/entity/content.entity';
import { TagEntity } from 'apps/user-server/src/api/content-tag/entity/tag.entity';
import { LocationEntity } from 'apps/user-server/src/api/culture-content/entity/location.entity';
import { LiketCultureContentModel } from 'libs/core/liket/model/liket-culture-content.model';

/**
 * @author jochongs
 */
export class LiketCultureContentEntity extends PickType(ContentEntity, [
  'idx',
  'title',
  'location',
  'genre',
]) {
  constructor(data: LiketCultureContentEntity) {
    super();
    Object.assign(this, data);
  }

  public static fromModel(
    model: LiketCultureContentModel,
  ): LiketCultureContentEntity {
    return new LiketCultureContentEntity({
      idx: model.idx,
      genre: TagEntity.fromModel(model.genre),
      title: model.title,
      location: LocationEntity.fromModel(model.location),
    });
  }
}
