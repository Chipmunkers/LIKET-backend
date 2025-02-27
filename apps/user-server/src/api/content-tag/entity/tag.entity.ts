import { Age, Genre, Style } from '@prisma/client';
import {
  SelectAgeFieldPrisma,
  SelectGenreFieldPrisma,
  SelectStyleFieldPrisma,
} from 'apps/user-server/src/api/content-tag/entity/prisma/select-tag-field';

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
}
