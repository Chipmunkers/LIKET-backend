/**
 * @author jochongs
 */
export class CreateLiketTextShapeInput {
  /**
   * 6 자리 또는 3 자리 기반의 Hex 컬러 코드
   *
   * @example "#f5d949" 혹은 "#f00"
   */
  public readonly fill: string;

  /**
   * 텍스트 내용
   */
  public readonly text: string;

  /**
   * 테스트 가로 위치
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
}
