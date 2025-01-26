import { InterestGenre } from '@prisma/client';

/**
 * @author jochongs
 */
export class GenreInterestEntity {
  /**
   * 장르 인덱스
   */
  genreIdx: number;

  constructor(data: GenreInterestEntity) {
    Object.assign(this, data);
  }

  static createEntity(interestGenre: InterestGenre): GenreInterestEntity {
    return new GenreInterestEntity({
      genreIdx: interestGenre.genreIdx,
    });
  }
}
