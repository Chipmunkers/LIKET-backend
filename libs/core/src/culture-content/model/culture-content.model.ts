import { CultureContentAuthorModel } from 'libs/core/culture-content/model/culture-content-author.model';
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
  idx: number;

  /**
   * 장르
   */
  genre: GenreModel;

  /**
   * 연령대
   */
  age: AgeModel;

  /**
   * 스타일 목록
   */
  styleList: StyleModel[];

  /**
   * 작성자
   */
  author: CultureContentAuthorModel;

  /**
   * 컨텐츠 지역 모델
   */
  location: CultureContentLocationModel;

  /**
   * 컨텐츠 ID
   */
  id: string | null;

  /**
   * 컨텐츠 제목
   */
  title: string;

  /**
   * 컨텐츠 설명
   */
  description: string | null;

  /**
   * 관련 웹사이트 링크
   */
  websiteLink: string | null;

  /**
   * 컨텐츠 시작 날짜
   */
  startDate: Date;

  /**
   * 컨텐츠 종료 날짜
   */
  endDate: Date | null;

  /**
   * 조회수
   */
  viewCount: number;

  /**
   * 오픈 시간
   */
  openTime: string | null;

  /**
   * 요금 여부
   */
  isFee: boolean;

  /**
   * 예약 여부
   */
  isReservation: boolean;

  /**
   * 반려동물 출입 가능 여부
   */
  isPet: boolean;

  /**
   * 주차 가능 여부
   */
  isParking: boolean;

  /**
   * 좋아요 수
   */
  likeCount: number;

  /**
   * 생성일
   */
  createdAt: Date;

  /**
   * 활성화 된 시간
   */
  acceptedAt: Date | null;

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
      createdAt: content.createdAt,
      acceptedAt: content.acceptedAt,
    });
  }
}
