import { Age, Genre, Style } from '@prisma/client';
import {
  SelectAgeFieldPrisma,
  SelectGenreFieldPrisma,
  SelectStyleFieldPrisma,
} from 'apps/user-server/src/api/content-tag/entity/prisma/select-tag-field';
import { AgeModel } from 'libs/core/tag-root/age/model/age.model';
import { GenreModel } from 'libs/core/tag-root/genre/model/genre.model';
import { StyleModel } from 'libs/core/tag-root/style/model/style.model';

/**
 * @author jochongs
 */
export class TagEntity {
  /**
   * 장르 또는 스타일 또는 연령대의 인덱스
   *
   * @example 1
   */
  public idx: number;

  /**
   * 장르 또는 스타일 또는 연령대의 인덱스
   *
   * @example 전시회
   */
  public name: string;

  constructor(data: TagEntity) {
    Object.assign(this, data);
  }

  /**
   * `CultureContentCoreModule`이 만들어짐에따라 deprecated 되었습니다.
   * 대신 `fromModel` 정적 메서드를 사용하십시오.
   *
   * @deprecated
   */
  static createEntity(
    data:
      | SelectAgeFieldPrisma
      | SelectGenreFieldPrisma
      | SelectStyleFieldPrisma,
  ): TagEntity {
    return new TagEntity({
      idx: data.idx,
      name: data.name,
    });
  }

  public static fromModel(data: StyleModel | GenreModel | AgeModel): TagEntity {
    return new TagEntity({
      idx: data.idx,
      name: data.name,
    });
  }
}
