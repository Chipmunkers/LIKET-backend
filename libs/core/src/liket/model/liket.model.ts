import { LiketAuthorModel } from 'libs/core/liket/model/liket-author.model';
import { LiketBgImgInfoModel } from 'libs/core/liket/model/liket-bg-img-info.model';
import { LiketCultureContentModel } from 'libs/core/liket/model/liket-culture-content.model';
import { LiketImgShapeModel } from 'libs/core/liket/model/liket-img-shape.model';
import { LiketReviewModel } from 'libs/core/liket/model/liket-review.model';
import { LiketTextShapeModel } from 'libs/core/liket/model/liket-text-shape.model';
import { LiketSelectField } from 'libs/core/liket/model/prisma/liket-select-field';

/**
 * @author jochongs
 */
export class LiketModel {
  /** 라이켓 식별자 */
  public readonly idx: number;

  /** 라이켓 카드 이미지 경로 */
  public readonly cardImgPath: string;

  /**
   * 라이켓 카드 사이즈
   */
  public readonly size: 1 | 2 | 3;

  /**
   * 카드의 텍스트 꾸미기 정보
   */
  public readonly textShape: LiketTextShapeModel | null;

  /**
   * 카드 꾸미는 스티커 정보
   */
  public readonly imgShapes: LiketImgShapeModel[];

  /**
   * 라이켓 카드 배경 이미지 정보
   */
  public readonly bgImgInfo: LiketBgImgInfoModel;

  /**
   * 라이켓 카드 배경 이미지 경로
   */
  public readonly bgImgPath: string;

  /**
   * 연결된 컨텐츠 정보
   */
  public readonly cultureContent: LiketCultureContentModel;

  /**
   * 연결된 리뷰 정보
   */
  public readonly review: LiketReviewModel;

  /**
   * 작성자 정보
   */
  public readonly author: LiketAuthorModel;

  constructor(data: LiketModel) {
    Object.assign(this, data);
  }

  public static fromPrisma(liket: LiketSelectField): LiketModel {
    return new LiketModel({
      idx: liket.idx,
      cardImgPath: liket.cardImgPath,
      size: liket.size as 1 | 2 | 3,
      textShape: LiketTextShapeModel.fromPrisma(liket.textShape),
      imgShapes: liket.LiketImgShape.map(LiketImgShapeModel.fromPrisma),
      bgImgPath: liket.bgImgPath,
      bgImgInfo: LiketBgImgInfoModel.fromPrisma(liket.bgImgInfo),
      author: LiketAuthorModel.fromPrisma(liket.Review.User),
      review: LiketReviewModel.fromPrisma(liket.Review),
      cultureContent: LiketCultureContentModel.fromPrisma(
        liket.Review.CultureContent,
      ),
    });
  }
}
