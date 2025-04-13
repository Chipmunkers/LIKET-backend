import { PickType } from '@nestjs/swagger';
import { CultureContentLocationModel } from 'libs/core/culture-content/model/culture-content-location.model';
import { CultureContentModel } from 'libs/core/culture-content/model/culture-content.model';
import { LiketCultureContentSelectField } from 'libs/core/liket/model/prisma/liket-culture-content-select-field';
import { GenreModel } from 'libs/core/tag-root/genre/model/genre.model';

/**
 * @author jochongs
 */
export class LiketCultureContentModel extends PickType(CultureContentModel, [
  'idx',
  'title',
  'location',
  'genre',
]) {
  constructor(data: LiketCultureContentModel) {
    super();
    Object.assign(this, data);
  }

  public static fromPrisma(
    content: LiketCultureContentSelectField,
  ): LiketCultureContentModel {
    return new LiketCultureContentModel({
      idx: content.idx,
      title: content.title,
      genre: GenreModel.fromPrisma(content.Genre),
      location: CultureContentLocationModel.fromPrisma(content.Location),
    });
  }
}
