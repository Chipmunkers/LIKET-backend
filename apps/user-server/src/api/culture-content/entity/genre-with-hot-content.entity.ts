import { PickType } from '@nestjs/swagger';
import { TagEntity } from 'apps/user-server/src/api/content-tag/entity/tag.entity';
import { HotCultureContentEntity } from 'apps/user-server/src/api/culture-content/entity/hot-content.entity';
import { SelectGenreWithHotContentFieldPrisma } from 'apps/user-server/src/api/culture-content/entity/prisma/select-genre-with-hot-content-field';
import { GenreWithHotCultureContentsModel } from 'libs/core/culture-content/model/genre-with-hot-culture-contents.model';

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

  /**
   * core 모듈이 개발됨에 따라 deprecated 되었습니다.
   * 대신, fromModel 정적 메서드를 사용하십시오.
   *
   * @deprecated
   */
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

  public static fromModel(
    genre: GenreWithHotCultureContentsModel,
  ): GenreWithHotContentEntity {
    return new GenreWithHotContentEntity({
      idx: genre.idx,
      name: genre.name,
      contentList: genre.contentList.map(HotCultureContentEntity.fromModel),
    });
  }
}
