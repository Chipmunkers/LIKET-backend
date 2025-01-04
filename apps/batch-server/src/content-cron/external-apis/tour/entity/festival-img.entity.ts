import { FestivalImgFromApi } from 'apps/batch-server/src/content-cron/external-apis/tour/type/festival-img-from-api';

/**
 * @author jochongs
 */
export class FestivalImgEntity {
  /**
   * 컨텐츠 아이디
   */
  contentId: string;

  /**
   * 원본 이미지
   */
  origin: string;

  /**
   * 작게 축소한 이미지
   */
  small: string;

  constructor(data: FestivalImgEntity) {
    Object.assign(this, data);
  }

  static createEntityFromApi(festivalImg: FestivalImgFromApi) {
    return new FestivalImgEntity({
      origin: festivalImg.originimgurl,
      small: festivalImg.smallimageurl,
      contentId: festivalImg.contentid,
    });
  }
}
