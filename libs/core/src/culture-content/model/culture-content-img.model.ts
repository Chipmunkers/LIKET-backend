import { CultureContentImgSelectField } from 'libs/core/culture-content/model/prisma/culture-content-img-select-field';

/**
 * @author jochongs
 */
export class CultureContentImgModel {
  /**
   * 이미지 식별자
   */
  public readonly idx: number;

  /**
   * 이미지 경로
   *
   * @example "/culture-content/00001.png"
   */
  public readonly imgPath: string;

  /**
   * 이미지 생성일
   */
  public readonly createdAt: Date;

  constructor(data: CultureContentImgModel) {
    Object.assign(this, data);
  }

  public static fromPrisma(
    img: CultureContentImgSelectField,
  ): CultureContentImgModel {
    return new CultureContentImgModel({
      idx: img.idx,
      imgPath: img.imgPath,
      createdAt: img.createdAt,
    });
  }
}
