import { CultureContentAuthorModel } from 'libs/core/culture-content/model/culture-content-author.model';
import { CultureContentLocationModel } from 'libs/core/culture-content/model/culture-content-location.model';
import { GenreModel } from 'libs/core/tag-root/genre/model/genre.model';

/**
 * @author jochongs
 */
export class CultureContentModel {
  /**
   * 컨텐츠 식별자
   */
  idx: number;

  /**
   * 장르
   */
  genre: GenreModel;

  /**
   * 작성자
   */
  author: CultureContentAuthorModel;

  /**
   * 컨텐츠 지역 모델
   */
  location: CultureContentLocationModel;

  // TODO: 나머지 필드 작성해야함
}
