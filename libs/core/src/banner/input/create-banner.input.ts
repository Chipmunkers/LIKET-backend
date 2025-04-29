/**
 * @author jochongs
 */
export class CreateBannerInput {
  /** 배너 명 */
  public readonly name: string;

  /** 배너 이미지 경로 */
  public readonly imgPath: string;

  /** 배너 링크 */
  public readonly link: string;
}
