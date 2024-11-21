import { UserProfileEntity } from '../../user/entity/user-profile.entity';
import { TagEntity } from '../../content-tag/entity/tag.entity';
import { ReviewWithInclude } from './prisma-type/review-with-include';
import { PickType } from '@nestjs/swagger';
import { ContentEntity } from '../../culture-content/entity/content.entity';
import {
  IsDate,
  IsDateString,
  IsIn,
  IsNumber,
  IsString,
  Length,
} from 'class-validator';

class ReviewContent extends PickType(ContentEntity, [
  'idx',
  'title',
  'genre',
  'likeCount',
  'thumbnail',
] as const) {}

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
  public cultureContent: ReviewContent;

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
}
