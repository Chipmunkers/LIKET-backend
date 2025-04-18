import { TagEntity } from '../../content-tag/entity/tag.entity';
import { LocationEntity } from '../../culture-content/entity/location.entity';
import {
  ArrayMaxSize,
  ArrayMinSize,
  IsArray,
  IsDateString,
  IsIn,
  IsInt,
  IsObject,
  IsOptional,
  IsString,
  Length,
  Max,
  Min,
  ValidateNested,
} from 'class-validator';
import { TextShapeEntity } from './text-shape.entity';
import { ImgShapeEntity } from './img-shape.entity';
import { BgImgInfoEntity } from './bg-img-info.entity';
import { LiketWithInclude } from './prisma-type/liket-with-include';
import { Type } from 'class-transformer';
import { LiketModel } from 'libs/core/liket/model/liket.model';
import { LiketReviewEntity } from 'apps/user-server/src/api/liket/entity/liket-review.entity';
import { LiketAuthorEntity } from 'apps/user-server/src/api/liket/entity/liket-author.entity';
import { LiketCultureContentEntity } from 'apps/user-server/src/api/liket/entity/liket-culture-content.entity';

/**
 * @author wherehows
 */
export class LiketEntity {
  /**
   * 라이켓 인덱스
   */
  public idx: number;

  /**
   * 라이켓 카드 이미지 경로
   *
   * @example /liket/img_000001.png
   */
  @IsString()
  @Length(1, 200)
  public cardImgPath: string;

  /**
   * 카드 사이즈
   *
   * @example 3
   */
  @IsInt()
  @IsIn([1, 2, 3])
  public size: 1 | 2 | 3;

  /**
   * 카드를 꾸미는 텍스트 정보
   */
  @ValidateNested()
  @Type(() => TextShapeEntity)
  @IsOptional()
  @IsObject()
  public textShape?: TextShapeEntity;

  /**
   * 카드를 꾸미는 스티커 정보
   */
  @ValidateNested({
    each: true,
  })
  @Type(() => ImgShapeEntity)
  @IsOptional()
  @IsArray()
  @ArrayMinSize(0)
  @ArrayMaxSize(9)
  public imgShapes: ImgShapeEntity[] = [];

  /**
   * 라이켓 카드 배경 이미지 경로
   * @example /liket/bg/img_000001.png
   */
  @IsString()
  public bgImgPath: string;

  /**
   * 라이켓 카드 배경 이미지 정보
   */
  @ValidateNested()
  @Type(() => BgImgInfoEntity)
  @IsObject()
  public bgImgInfo: BgImgInfoEntity;

  /**
   * 컨텐
   */
  public cultureContent: LiketCultureContentEntity;

  /**
   * 리뷰
   */
  public review: LiketReviewEntity;

  /**
   * 작성자
   */
  public author: LiketAuthorEntity;

  /**
   * 리뷰 텍스트
   *
   * @example "너무 좋았던 팝업 스토어"
   */
  @IsString()
  @Length(1, 42)
  public description: string;

  /**
   * 라이켓 작성 시간
   *
   * @example 2024-05-07T00:00:00.000Z
   */
  @IsDateString()
  public createdAt: Date;

  constructor(data: LiketEntity) {
    Object.assign(this, data);
  }

  /**
   * @deprecated
   */
  static createEntity(
    data: LiketWithInclude,
    bgImgInfo: BgImgInfoEntity,
    imgShapes: ImgShapeEntity[],
    textShape?: TextShapeEntity,
  ) {
    const review = data.Review;
    const content = review.CultureContent;
    const User = review.User;

    return new LiketEntity({
      idx: data.idx,
      cardImgPath: data.cardImgPath,
      bgImgPath: data.bgImgPath,
      size: data.size as any,
      review: {
        starRating: review.starRating,
        visitTime: review.visitTime,
      },
      textShape: textShape
        ? TextShapeEntity.createEntity(textShape)
        : undefined,
      imgShapes: imgShapes.map((imgShape) => {
        return ImgShapeEntity.createEntity(imgShape);
      }),
      bgImgInfo: BgImgInfoEntity.createEntity(bgImgInfo),
      description: data.description,
      cultureContent: {
        idx: content.idx,
        title: content.title,
        genre: TagEntity.createEntity(content.Genre),
        location: LocationEntity.createEntity(content.Location),
      },
      author: {
        idx: User.idx,
        nickname: User.nickname,
        profileImgPath: User.profileImgPath,
        provider: User.provider,
      },
      createdAt: data.createdAt,
    });
  }

  public static fromModel(model: LiketModel): LiketEntity {
    return new LiketEntity({
      idx: model.idx,
      cardImgPath: model.cardImgPath,
      bgImgPath: model.bgImgPath,
      size: model.size,
      review: LiketReviewEntity.fromModel(model.review),
      author: LiketAuthorEntity.fromModel(model.author),
      bgImgInfo: BgImgInfoEntity.fromModel(model.bgImgInfo),
      cultureContent: LiketCultureContentEntity.fromModel(model.cultureContent),
      createdAt: model.createdAt,
      description: model.description,
      imgShapes: model.imgShapes.map(ImgShapeEntity.fromModel),
      textShape: model.textShape
        ? TextShapeEntity.fromModel(model.textShape)
        : undefined,
    });
  }
}
