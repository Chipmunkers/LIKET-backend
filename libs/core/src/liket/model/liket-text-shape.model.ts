/**
 * @author jochongs
 */
export class LiketTextShapeModel {
  /**
   * 6 자리 또는 3 자리 기반의 Hex 컬러 코드
   *
   * @example "#f5d949" 혹은 "#f00"
   */
  public readonly fill: string;

  /**
   * 텍스트 내용
   *
   * @example "별이 빛나는 밤에"
   */
  public readonly text: string;

  /**
   * 텍스트 가로 위치
   *
   * @example 108
   */
  public readonly x: number;

  /**
   * 텍스트 세로 위치
   *
   * @example 209
   */
  public readonly y: number;

  constructor(data: LiketTextShapeModel) {
    Object.assign(this, data);
  }

  public static fromPrisma(data: LiketTextShapeModel) {
    return new LiketTextShapeModel({
      fill: data.fill,
      text: data.text,
      x: data.x,
      y: data.y,
    });
  }
}
