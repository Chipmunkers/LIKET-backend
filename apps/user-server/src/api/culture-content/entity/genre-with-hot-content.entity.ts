import { PickType } from '@nestjs/swagger';
import { TagEntity } from 'apps/user-server/src/api/content-tag/entity/tag.entity';
import { HotCultureContentEntity } from 'apps/user-server/src/api/culture-content/entity/hot-content.entity';
import { SelectGenreWithHotContentFieldPrisma } from 'apps/user-server/src/api/culture-content/entity/prisma/select-genre-with-hot-content-field';

/**
 * @author jochongs
 */
export class GenreWithHotContentEntity extends PickType(TagEntity, [
  'idx',
  'name',
]) {
  contentList: HotCultureContentEntity[];

  constructor(data: GenreWithHotContentEntity) {
    super();
    Object.assign(this, data);
  }

  static createEntity(
    genre: SelectGenreWithHotContentFieldPrisma,
  ): GenreWithHotContentEntity {
    const { CultureContent: contentList } = genre;

    return new GenreWithHotContentEntity({
      idx: genre.idx,
      name: genre.name,
      contentList: contentList.map((content) =>
        HotCultureContentEntity.createEntity(content),
      ),
    });
  }
}
