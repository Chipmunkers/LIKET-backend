import { IsInt, IsNumber, Max, Min } from 'class-validator';
import { LiketImgShapeModel } from 'libs/core/liket/model/liket-img-shape.model';

/**
 * @author wherehows
 */
export class ImgShapeEntity {
  /**
   * 여러 이미지나 스티커가 존재할 때 특정 이미지나 스티커를 이동 + 삭제 시키기 위해 구분하는 필드
   *
   */
  @IsInt()
  @Max(9)
  @Min(0)
  public code: number;

  /**
   * 스티커가 회전한 각도
   * @example 306
   */
  @IsNumber()
  @Min(-360)
  @Max(360)
  public rotation: number;

  /**
   * 스티커를 구분하는 필드
   *
   * @example 1
   */
  @IsInt()
  @Min(0)
  @Max(13)
  public stickerNumber: number;

  /**
   * 스티커 가로 길이
   *
   * @example 164.90748039256275
   */
  @IsNumber()
  public width: number;

  /**
   * 스티커 세로 길이
   *
   * @example 109.52810264879164
   */
  @IsNumber()
  public height: number;

  /**
   * 스티커 가로 위치
   *
   * @example 108
   */
  @IsNumber()
  public x: number;

  /**
   * 스티커 세로 위치
   *
   * @example 209
   */
  @IsNumber()
  public y: number;

  constructor(data: ImgShapeEntity) {
    Object.assign(this, data);
  }

  static createEntity(data: ImgShapeEntity) {
    return new ImgShapeEntity({
      code: data.code,
      stickerNumber: data.stickerNumber,
      width: data.width,
      height: data.height,
      rotation: data.rotation,
      x: data.x,
      y: data.y,
    });
  }

  static isSameStructure(obj: unknown): obj is ImgShapeEntity {
    if (typeof obj !== 'object' || obj === null) {
      return false;
    }

    const { code, stickerNumber, width, height, x, y, rotation } =
      obj as ImgShapeEntity;

    return (
      typeof code === 'number' &&
      typeof stickerNumber === 'number' &&
      typeof width === 'number' &&
      typeof height === 'number' &&
      typeof x === 'number' &&
      typeof y === 'number' &&
      typeof rotation === 'number' &&
      code >= 0 &&
      code <= 9 &&
      stickerNumber >= 1 &&
      stickerNumber <= 13
    );
  }

  public static fromModel(model: LiketImgShapeModel): ImgShapeEntity {
    return new ImgShapeEntity({
      code: model.code,
      stickerNumber: model.stickerNumber,
      width: model.width,
      height: model.height,
      rotation: model.rotation,
      x: model.x,
      y: model.y,
    });
  }
}
