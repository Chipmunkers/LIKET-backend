import { PickType } from '@nestjs/swagger';
import { TagEntity } from '../../content-tag/entity/tag.entity';
import { ContentEntity } from './content.entity';
import { SelectHotContentFieldPrisma } from 'apps/user-server/src/api/culture-content/entity/prisma/select-hot-content-field';

/**
 * @author jochongs
 */
export class HotCultureContentEntity extends PickType(ContentEntity, [
  'idx',
  'title',
  'startDate',
  'endDate',
  'thumbnail',
]) {
  constructor(data: HotCultureContentEntity) {
    super();
    Object.assign(this, data);
  }

  static createEntity(
    content: SelectHotContentFieldPrisma,
  ): HotCultureContentEntity {
    return new HotCultureContentEntity({
      idx: content.idx,
      title: content.title,
      startDate: content.startDate,
      endDate: content.endDate,
      thumbnail: content.ContentImg[0]?.imgPath || '',
    });
  }
}
