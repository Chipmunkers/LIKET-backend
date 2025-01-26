import { InterestGenre } from '@prisma/client';

/**
 * @author jochongs
 */
export class InterestGenreEntity {
  /**
   * 장르 인덱스
   */
  genreIdx: number;

  constructor(data: InterestGenreEntity) {
    Object.assign(this, data);
  }

  static createEntity(interestGenre: InterestGenre): InterestGenreEntity {
    return new InterestGenreEntity({
      genreIdx: interestGenre.genreIdx,
    });
  }
}
