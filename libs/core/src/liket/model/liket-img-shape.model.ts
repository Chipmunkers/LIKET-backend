/**
 * @author jochongs
 */
export class LiketImgShapeModel {
  /**
   * 여러 이미지나 스티커가 존재할 때 특정 이미지나 스티커를 이동 + 삭제 시키기 위해 구분하는 필드
   *
   */
  public readonly code: number;

  /**
   * 스티커가 회전한 각도
   *
   * @example 306
   */
  public readonly rotation: number;

  /**
   * 스티커를 구분하는 필드
   *
   * @example 1
   */
  public readonly stickerNumber: number;

  /**
   * 스티커 가로 길이
   *
   * @example 164.90748039256275
   */
  public readonly width: number;

  /**
   * 스티커 세로 길이
   *
   * @example 109.52810264879164
   */
  public readonly height: number;

  /**
   * 스티커 가로 위치
   *
   * @example 108
   */
  public readonly x: number;

  /**
   * 스티커 세로 위치
   *
   * @example 209
   */
  public readonly y: number;

  constructor(data: LiketImgShapeModel) {
    Object.assign(this, data);
  }

  public static fromPrisma(data: any) {
    return new LiketImgShapeModel({
      code: data.code,
      stickerNumber: data.stickerNumber,
      width: data.width,
      height: data.height,
      rotation: data.rotation,
      x: data.x,
      y: data.y,
    });
  }
}
