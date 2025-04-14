/**
 * @author jochongs
 */
export class LiketBgImgInfoModel {
  /**
   * 각도
   *
   * @example -304.24485701721770
   */
  public readonly rotation: number;

  /**
   * 가로 길이
   *
   * @example 109.52810264879164
   */
  public readonly width: number;

  /**
   * 세로 길이
   *
   * @example 109.52810264879164
   */
  public readonly height: number;

  /**
   * x 좌표 offset
   *
   * @example 82.44220158804448
   */
  public readonly offsetX: number;

  /**
   * y 좌표 offset
   *
   * @example 54.75638762191013
   */
  public readonly offsetY: number;

  /**
   * 가로 위치
   *
   * @example 108
   */
  public readonly x: number;

  /**
   * 세로 위치
   *
   * @example 209
   */
  public readonly y: number;

  constructor(data: LiketBgImgInfoModel) {
    Object.assign(this, data);
  }

  public static fromPrisma(bgInfo: any): LiketBgImgInfoModel {
    return new LiketBgImgInfoModel({
      rotation: bgInfo.rotation,
      width: bgInfo.width,
      height: bgInfo.height,
      offsetX: bgInfo.offsetX,
      offsetY: bgInfo.offsetY,
      x: bgInfo.x,
      y: bgInfo.y,
    });
  }
}
