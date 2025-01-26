import { InterestGenre } from '@prisma/client';

/**
 * @author jochongs
 */
export class InterestGenreEntity {
  /**
   * 장르 인덱스
   */
  idx: number;

  constructor(data: InterestGenreEntity) {
    Object.assign(this, data);
  }

  static createEntity(interestGenre: InterestGenre): InterestGenreEntity {
    return new InterestGenreEntity({
      idx: interestGenre.genreIdx,
    });
  }
}
