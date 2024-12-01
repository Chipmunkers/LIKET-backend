import { PickType } from '@nestjs/swagger';
import { TagEntity } from '../../content-tag/entity/tag.entity';
import { ContentEntity } from './content.entity';
import { GenreWithContent } from './prisma-type/genre-with-content';

/**
 * @author jochongs
 */
class HotCultureContent extends PickType(ContentEntity, [
  'idx',
  'title',
  'startDate',
  'endDate',
  'thumbnail',
]) {}

/**
 * @author jochongs
 */
export class HotCultureContentEntity extends PickType(TagEntity, [
  'idx',
  'name',
]) {
  contentList: HotCultureContent[];

  constructor(data: HotCultureContentEntity) {
    super();
    Object.assign(this, data);
  }

  static createHotContent(genre: GenreWithContent) {
    return new HotCultureContentEntity({
      idx: genre.idx,
      name: genre.name,
      contentList: genre.CultureContent.map((content) => ({
        idx: content.idx,
        title: content.title,
        startDate: content.startDate,
        endDate: content.endDate,
        thumbnail: content.ContentImg[0]?.imgPath || '',
      })),
    });
  }
}
