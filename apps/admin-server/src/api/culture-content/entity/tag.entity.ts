import { Age, Genre, Style } from '@prisma/client';

export class TagEntity {
  /**
   * 태그 인덱스 (장르, 연령대, 스타일 모두 포함)
   *
   * @example 2
   */
  idx: number;

  /**
   * 태그 이름 (장르, 연령대, 스타일)
   *
   * @example 영화
   */
  name: string;

  private constructor(data: TagEntity) {
    Object.assign(this, data);
  }

  static createEntity(tag: Age | Genre | Style) {
    return new TagEntity({
      idx: tag.idx,
      name: tag.name,
    });
  }
}
