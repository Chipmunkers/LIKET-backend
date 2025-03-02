import { UserProfileEntity } from '../../user/entity/user-profile.entity';
import { TagEntity } from '../../content-tag/entity/tag.entity';
import { ReviewWithInclude } from './prisma-type/review-with-include';
import {
  IsDateString,
  IsIn,
  IsNumber,
  IsString,
  Length,
} from 'class-validator';
import { ReviewCultureContentEntity } from 'apps/user-server/src/api/review/entity/review-culture-content.entity';
import { ReviewModel } from 'libs/core/review/model/review.model';
import { ReviewAuthorEntity } from 'apps/user-server/src/api/review/entity/review-author.entity';

/**
 * @author jochongs
 */
export class ReviewEntity {
  /**
   * 리뷰 인덱스
   *
   * @example 12
   */
  public idx: number;

  /**
   * 방문 시간
   *
   * @example 2024-05-07T12:12:12.000Z
   */
  @IsDateString()
  public visitTime: Date;

  /**
   * 리뷰 썸네일 이미지
   *
   * @example "/review/img_00002.png"
   */
  public thumbnail: string | null;

  /**
   * 문화생활컨텐츠 정보
   */
  public cultureContent: ReviewCultureContentEntity;

  /**
   * 작성자
   */
  public author: UserProfileEntity;

  /**
   * 리뷰 작성 시간
   *
   * @example 2024-05-07T00:00:00.000Z
   */
  @IsDateString()
  public createdAt: Date;

  /**
   * 좋아요 여부
   *
   * @example true
   */
  public likeState: boolean;

  /**
   * 리뷰 이미지 배열
   *
   * @example ["/review/img_00001.png"]
   */
  public imgList: string[];

  /**
   * 리뷰 내용
   *
   * @example "성수 디올 팝업스토어 디올 뷰티, 들어가자 마자 예쁜 야외 정원이 있는"
   */
  @IsString()
  @Length(1, 1000)
  public description: string;

  /**
   * 별점
   *
   * @example 4
   */
  @IsNumber()
  @IsIn([1, 2, 3, 4, 5])
  public starRating: number;

  /**
   * 좋아요 개수
   *
   * @example 83
   */
  public likeCount: number;

  constructor(data: ReviewEntity) {
    Object.assign(this, data);
  }

  /**
   * `core` 모듈이 개발됨에 따라 deprecated 되었습니다.
   * 대신, `fromModel`을 사용하십시오.
   *
   * @deprecated
   */
  static createEntity(review: ReviewWithInclude) {
    return new ReviewEntity({
      idx: review.idx,
      visitTime: review.visitTime,
      thumbnail: review.ReviewImg[0]?.imgPath || '',
      cultureContent: {
        idx: review.CultureContent.idx,
        genre: TagEntity.createEntity(review.CultureContent.Genre),
        title: review.CultureContent.title,
        likeCount: review.CultureContent.likeCount,
        thumbnail: review.CultureContent.ContentImg[0]?.imgPath,
      },
      author: UserProfileEntity.createEntity(review.User),
      createdAt: review.createdAt,
      imgList: review.ReviewImg.map((img) => img.imgPath),
      description: review.description,
      starRating: review.starRating,
      likeCount: review.likeCount,
      likeState: review.ReviewLike[0] ? true : false,
    });
  }

  public static fromModel(model: ReviewModel): ReviewEntity {
    return new ReviewEntity({
      idx: model.idx,
      author: ReviewAuthorEntity.fromModel(model.author),
      cultureContent: ReviewCultureContentEntity.fromModel(model.content),
      visitTime: model.visitTime,
      starRating: model.starRating,
      description: model.description,
      thumbnail: model.imgList[0]?.imgPath || '',
      imgList: model.imgList.map(({ imgPath }) => imgPath),
      likeCount: model.likeCount,
      likeState: model.likeState,
      createdAt: model.createdAt,
    });
  }
}
