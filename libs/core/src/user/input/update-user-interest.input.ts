import { Age } from 'libs/core/tag-root/age/constant/age';
import { Genre } from 'libs/core/tag-root/genre/constant/genre';
import { Style } from 'libs/core/tag-root/style/constant/style';

export class UpdateUserInterestInput {
  /** 수정할 장르 목록 */
  genreList?: Genre[];

  /** 수정할 스타일 목록 */
  styleList?: Style[];

  /** 수정할 연령대 목록 */
  ageList?: Age[];

  /**
   * 지역 목록 (법정동 코드 앞 두자리)
   *
   * 서울일 경우 11
   *
   * @example 11
   */
  locationList?: string[];
}
