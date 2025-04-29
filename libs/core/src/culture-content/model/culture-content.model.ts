import { CultureContentAuthorModel } from 'libs/core/culture-content/model/culture-content-author.model';
import { CultureContentImgModel } from 'libs/core/culture-content/model/culture-content-img.model';
import { CultureContentLocationModel } from 'libs/core/culture-content/model/culture-content-location.model';
import { CultureContentSelectField } from 'libs/core/culture-content/model/prisma/culture-content-select-field';
import { AgeModel } from 'libs/core/tag-root/age/model/age.model';
import { GenreModel } from 'libs/core/tag-root/genre/model/genre.model';
import { StyleModel } from 'libs/core/tag-root/style/model/style.model';

/**
 * @author jochongs
 */
export class CultureContentModel {
  /**
   * 컨텐츠 식별자
   */
  public readonly idx: number;

  /**
   * 장르
   */
  public readonly genre: GenreModel;

  /**
   * 연령대
   */
  public readonly age: AgeModel;

  /**
   * 스타일 목록
   */
  public readonly styleList: StyleModel[];

  /**
   * 작성자
   */
  public readonly author: CultureContentAuthorModel;

  /**
   * 컨텐츠 지역 모델
   */
  public readonly location: CultureContentLocationModel;

  /**
   * 컨텐츠 이미지 목록
   */
  public readonly imgList: CultureContentImgModel[];

  /**
   * 컨텐츠 ID
   */
  public readonly id: string | null;

  /**
   * 컨텐츠 제목
   */
  public readonly title: string;

  /**
   * 컨텐츠 설명
   */
  public readonly description: string | null;

  /**
   * 관련 웹사이트 링크
   */
  public readonly websiteLink: string | null;

  /**
   * 컨텐츠 시작 날짜
   */
  public readonly startDate: Date;

  /**
   * 컨텐츠 종료 날짜
   */
  public readonly endDate: Date | null;

  /**
   * 조회수
   */
  public readonly viewCount: number;

  /**
   * 오픈 시간
   */
  public readonly openTime: string | null;

  /**
   * 요금 여부
   */
  public readonly isFee: boolean;

  /**
   * 예약 여부
   */
  public readonly isReservation: boolean;

  /**
   * 반려동물 출입 가능 여부
   */
  public readonly isPet: boolean;

  /**
   * 주차 가능 여부
   */
  public readonly isParking: boolean;

  /**
   * 좋아요 수
   */
  public readonly likeCount: number;

  /**
   * 좋아요 여부
   */
  public readonly likeState: boolean;

  /**
   * 생성일
   */
  public readonly createdAt: Date;

  /**
   * 활성화 된 시간
   */
  public readonly acceptedAt: Date | null;

  constructor(data: CultureContentModel) {
    Object.assign(this, data);
  }

  public static fromPrisma(
    content: CultureContentSelectField,
  ): CultureContentModel {
    return new CultureContentModel({
      idx: content.idx,
      genre: GenreModel.fromPrisma(content.Genre),
      age: AgeModel.fromPrisma(content.Age),
      styleList: content.Style.map((style) =>
        StyleModel.fromPrisma(style.Style),
      ),
      author: CultureContentAuthorModel.fromPrisma(content.User),
      location: CultureContentLocationModel.fromPrisma(content.Location),
      imgList: content.ContentImg.map(CultureContentImgModel.fromPrisma),
      id: content.id,
      title: content.title,
      description: content.description,
      websiteLink: content.websiteLink,
      startDate: content.startDate,
      endDate: content.endDate,
      viewCount: content.viewCount,
      openTime: content.openTime,
      isFee: content.isFee,
      isReservation: content.isReservation,
      isPet: content.isPet,
      isParking: content.isParking,
      likeCount: content.likeCount,
      likeState: !!content.ContentLike[0],
      createdAt: content.createdAt,
      acceptedAt: content.acceptedAt,
    });
  }
}
