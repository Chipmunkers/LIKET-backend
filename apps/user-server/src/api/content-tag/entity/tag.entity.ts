import { Age, Genre, Style } from '@prisma/client';

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

  static createEntity(data: Age | Genre | Style): TagEntity {
    return new TagEntity({
      idx: data.idx,
      name: data.name,
    });
  }
}
