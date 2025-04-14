/**
 * @author jochongs
 */
export class CreateLiketImgShapeInput {
  /**
   * 스티커 식별자
   */
  public readonly code: number;

  /**
   * 스티커가 회전한 각도
   *
   * -360 ~ 360
   */
  public readonly rotation: number;

  /**
   * 스티커 종류
   */
  public readonly stickerNumber: number;

  /**
   * 스티커 가로 길이
   */
  public readonly width: number;

  /**
   * 스티커 세로 길이
   */
  public readonly height: number;

  /**
   * 스티커 가로 위치
   */
  public readonly x: number;

  /**
   * 스티커 세로 위치
   */
  public readonly y: number;
}
