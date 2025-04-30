import { GenreSelectField } from 'libs/core/tag-root/genre/model/prisma/genre-select-field';

/**
 * @author jochongs
 */
export class GenreModel {
  /**
   * 장르 식별자
   */
  idx: number;

  /**
   * 장르 명
   */
  name: string;

  /**
   * 생성일
   */
  createdAt: Date;

  constructor(data: GenreModel) {
    Object.assign(this, data);
  }

  public static fromPrisma(genre: GenreSelectField): GenreModel {
    return new GenreModel({
      idx: genre.idx,
      name: genre.name,
      createdAt: genre.createdAt,
    });
  }
}
