import { ReviewImgSelectField } from 'libs/core/review/model/prisma/review-img-select-field';

/**
 * @author jochongs
 */
export class ReviewImgModel {
  /**
   * 이미지 식별자
   */
  public readonly idx: number;

  /**
   * 이미지 경로
   *
   * @example "/review/00001.png"
   */
  public readonly imgPath: string;

  /**
   * 이미지 생성일
   */
  public readonly createdAt: Date;

  constructor(data: ReviewImgModel) {
    Object.assign(this, data);
  }

  public static fromPrisma(img: ReviewImgSelectField): ReviewImgModel {
    return new ReviewImgModel({
      idx: img.idx,
      imgPath: img.imgPath,
      createdAt: img.createdAt,
    });
  }
}
