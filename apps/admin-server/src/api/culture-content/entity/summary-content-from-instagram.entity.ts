import { UploadedFileEntity } from 'apps/user-server/src/api/upload/entity/uploaded-file.entity';
import { InstagramFeedEntity } from 'libs/modules';

/**
 * @author jochongs
 */
export class SummaryContentFromInstagramEntity {
  public contents: string;

  /**
   * 이미지 배열
   *
   * @example "/culture-content/000001_img.png"
   */
  public imgList: string[];

  constructor(data: SummaryContentFromInstagramEntity) {
    Object.assign(this, data);
  }

  public static from(
    contents: string,
    imgList: string[],
  ): SummaryContentFromInstagramEntity {
    return new SummaryContentFromInstagramEntity({
      contents,
      imgList,
    });
  }
}
