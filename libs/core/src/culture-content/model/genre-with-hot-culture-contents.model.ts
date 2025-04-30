import { PickType } from '@nestjs/swagger';
import { GenreWithHotCultureContentSelectField } from 'libs/core/culture-content/model/prisma/genre-with-hot-culture-content-select-field';
import { SummaryCultureContentModel } from 'libs/core/culture-content/model/summary-culture-content.model';
import { GenreModel } from 'libs/core/tag-root/genre/model/genre.model';

/**
 * @author jochongs
 */
export class GenreWithHotCultureContentsModel extends PickType(GenreModel, [
  'idx',
  'name',
]) {
  public readonly contentList: SummaryCultureContentModel[];

  constructor(data: GenreWithHotCultureContentsModel) {
    super();
    Object.assign(this, data);
  }

  public static fromPrisma(
    genre: GenreWithHotCultureContentSelectField,
  ): GenreWithHotCultureContentsModel {
    return new GenreWithHotCultureContentsModel({
      idx: genre.idx,
      name: genre.name,
      contentList: genre.CultureContent.map(
        SummaryCultureContentModel.fromPrisma,
      ),
    });
  }
}
