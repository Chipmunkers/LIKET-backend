import { InquiryImgSelectField } from 'libs/core/inquiry/model/prisma/inquiry-img-select-field';

/**
 * @author jochongs
 */
export class InquiryImgModel {
  /** 문의 이미지 식별자 */
  public readonly idx: number;

  /** 이미지 경로 */
  public readonly path: string;

  /** 생성 시간 */
  public readonly createdAt: Date;

  constructor(data: InquiryImgModel) {
    Object.assign(this, data);
  }

  public static fromPrisma(img: InquiryImgSelectField): InquiryImgModel {
    return new InquiryImgModel({
      idx: img.idx,
      path: img.imgPath,
      createdAt: img.createdAt,
    });
  }
}
