import { IsBoolean, IsDateString, IsString, Length } from 'class-validator';
import { TagEntity } from '../../content-tag/entity/tag.entity';
import { LocationEntity } from './location.entity';
import { CotnentWithInclude } from './prisma-type/content-with-include';

export class ContentEntity {
  /**
   * 컨텐츠 인덱스
   *
   * @example 1
   */
  public idx: number;

  /**
   * 컨텐츠 명
   *
   * @example 디올 팝업스토어
   */
  @IsString()
  @Length(1, 60)
  public title: string;

  /**
   * 컨텐츠 설명
   *
   * @example "서울에서 만나는 디올의 특별한 컨셉 스토어\nDIOR SEONGSU에서 펼쳐지는\n매혹적인 홀리데이 시즌을 경험해보세요.\n주중 | DIOR SEONGSU 앱을 통한 방문 예약 \n또는 현장 접수 가능\n주말 | 현장 접수만 가능\n12월 예약 서비스는 12월 4일 오후12시에 오픈 되오니,\n많은 관심 부탁드립니다."
   */
  @IsString()
  @Length(1, 2000)
  public description: string;

  /**
   * 컨텐츠 썸네일
   *
   * @example /culture-content/img_00001.png
   */
  public thumbnail: string;

  /**
   * 컨텐츠 이미지 배열
   *
   * @example ["/culture-content/img_000001.png", "/culture-content/img_000002.png"]
   */
  public imgList: string[];

  /**
   * 장르
   */
  public genre: TagEntity;

  /**
   * 스타일 배열
   */
  public style: TagEntity[];

  /**
   * 연령대
   */
  public age: TagEntity;

  /**
   * 지역
   */
  public location: LocationEntity;

  /**
   * 시작 날짜
   *
   * @example 2024-05-07T00:00:00.000Z
   */
  @IsDateString()
  public startDate: Date;

  /**
   * 끝나는 날짜
   *
   * @example 2024-05-07T00:00:00.000Z
   */
  @IsDateString()
  public endDate: Date;

  /**
   * 로그인 사용자의 좋아요 상태
   */
  public likeState: boolean;

  /**
   * 오픈 시간
   *
   * @example "월-금 12:00-20:00   토-일 11:00-20:00"
   */
  @IsString()
  @Length(1, 100)
  public openTime: string;

  /**
   * 컨텐츠 웹사이트 링크
   *
   * @example "https://google.com"
   */
  @IsString()
  @Length(1, 2000)
  public websiteLink: string;

  /**
   * 요금 여부
   *
   * @example true
   */
  @IsBoolean()
  public isFee: boolean;

  /**
   * 예약 필수 여부
   *
   * @example false
   */
  @IsBoolean()
  public isReservation: boolean;

  /**
   * 반려동물 입장 가능 여부
   *
   * @example true
   */
  @IsBoolean()
  public isPet: boolean;

  /**
   * 주차 가능 여부
   *
   * @example true
   */
  @IsBoolean()
  public isParking: boolean;

  /**
   * 좋아요 개수
   *
   * @example 12
   */
  public likeCount: number;

  /**
   * 리뷰 개수
   *
   * @example 18
   */
  public reviewCount: number;

  /**
   * 리뷰 평균 점수
   *
   * @example 3.4
   */
  public avgStarRating: number;

  /**
   * 컨텐츠 생성 시간
   *
   * @example 2024-05-07T00:00:00.000Z
   */
  public createdAt: Date;

  /**
   * 컨텐츠 활성 시간
   *
   * @example 2024-05-07T00:00:00.000Z
   */
  public acceptedAt: Date | null;

  constructor(data: ContentEntity) {
    Object.assign(this, data);
  }

  static createEntity(data: CotnentWithInclude, totalSumStar?: number) {
    return new ContentEntity({
      idx: data.idx,
      title: data.title,
      thumbnail: data.ContentImg[0]?.imgPath || '',
      genre: TagEntity.createEntity(data.Genre),
      style: data.Style.map((style) => TagEntity.createEntity(style.Style)),
      age: TagEntity.createEntity(data.Age),
      location: LocationEntity.createEntity(data.Location),
      startDate: data.startDate,
      endDate: data.endDate,
      openTime: data.openTime,
      description: data.description,
      websiteLink: data.websiteLink,
      imgList: data.ContentImg.map((img) => img.imgPath),
      isFee: data.isFee,
      isReservation: data.isReservation,
      isPet: data.isPet,
      isParking: data.isParking,
      likeCount: data.likeCount,
      likeState: data.ContentLike[0] ? true : false,
      reviewCount: data._count.Review,
      createdAt: data.createdAt,
      acceptedAt: data.acceptedAt,
      avgStarRating: totalSumStar ? totalSumStar / data._count.Review : 0,
    });
  }
}
