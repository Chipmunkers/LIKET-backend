import { IsNumber, Max, Min } from 'class-validator';

/**
 * @author wherehows
 */
export class BgImgInfoEntity {
  /**
   * 각도
   *
   * @example -304.24485701721770
   */
  @IsNumber()
  @Min(-360)
  @Max(360)
  public rotation: number;

  /**
   * 가로 길이
   *
   * @example 109.52810264879164
   */
  @IsNumber()
  public width: number;

  /**
   * 세로 길이
   *
   * @example 109.52810264879164
   */
  @IsNumber()
  public height: number;

  /**
   * x 좌표 offset
   *
   * @example 82.44220158804448
   */
  @IsNumber()
  public offsetX: number;

  /**
   * y 좌표 offset
   *
   * @example 54.75638762191013
   */

  @IsNumber()
  public offsetY: number;

  /**
   * 가로 위치
   *
   * @example 108
   */
  @IsNumber()
  public x: number;

  /**
   * 세로 위치
   *
   * @example 209
   */
  @IsNumber()
  public y: number;

  constructor(data: BgImgInfoEntity) {
    Object.assign(this, data);
  }

  static createEntity(data: BgImgInfoEntity) {
    return new BgImgInfoEntity({
      rotation: data.rotation,
      width: data.width,
      height: data.height,
      offsetX: data.offsetX,
      offsetY: data.offsetY,
      x: data.x,
      y: data.y,
    });
  }

  static isSameStructure(obj: unknown): obj is BgImgInfoEntity {
    if (typeof obj !== 'object' || obj === null) {
      return false;
    }

    const { width, height, x, y, rotation, offsetX, offsetY } =
      obj as BgImgInfoEntity;

    return (
      typeof rotation === 'number' &&
      typeof width === 'number' &&
      typeof height === 'number' &&
      typeof offsetX === 'number' &&
      typeof offsetY === 'number' &&
      typeof x === 'number' &&
      typeof y === 'number'
    );
  }
}
