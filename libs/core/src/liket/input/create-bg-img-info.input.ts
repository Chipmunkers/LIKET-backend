/**
 * @author jochongs
 */
export class CreateBgImgInfoInput {
  /**
   * 배경 이미지 각도
   */
  public readonly rotation: number;

  /**
   * 배경 이미지 가로 길이
   */
  public readonly width: number;

  /**
   * 배경 이미지 세로 길이
   */
  public readonly height: number;

  /**
   * x좌표 offset
   */
  public readonly offsetX: number;

  /**
   * y좌표 offset
   */
  public readonly offsetY: number;

  /**
   * 배경 이미지 가로 위치
   */
  public readonly x: number;

  /**
   * 배경 이미지 세로 위치
   */
  public readonly y: number;
}
