import { Prisma } from '@prisma/client';
import { TagEntity } from './tag.entity';
import { SummaryContentEntity } from './summary-content.entity';
import { LocationEntity } from './location.entity';

const ContentWithInclude = Prisma.validator<Prisma.CultureContentDefaultArgs>()(
  {
    include: {
      User: true,
      ContentImg: true,
      Genre: true,
      Style: {
        include: {
          Style: true,
        },
      },
      Age: true,
      Location: true,
      ContentLike: true,
      _count: {
        select: {
          Review: true,
        },
      },
    },
  },
);

type CotnentWithInclude = Prisma.CultureContentGetPayload<
  typeof ContentWithInclude
>;

export class ContentEntity extends SummaryContentEntity {
  /**
   * 오픈 시간
   *
   * @example "월-금 12:00-20:00   토-일 11:00-20:00"
   */
  public openTime: string;

  /**
   * 컨텐츠 설명
   *
   * @example "서울에서 만나는 디올의 특별한 컨셉 스토어\nDIOR SEONGSU에서 펼쳐지는\n매혹적인 홀리데이 시즌을 경험해보세요.\n주중 | DIOR SEONGSU 앱을 통한 방문 예약 \n또는 현장 접수 가능\n주말 | 현장 접수만 가능\n12월 예약 서비스는 12월 4일 오후12시에 오픈 되오니,\n많은 관심 부탁드립니다."
   */
  public description: string;

  /**
   * 컨텐츠 웹사이트 링크
   *
   * @example "https://google.com"
   */
  public websiteLink: string;

  /**
   * 컨텐츠 이미지 배열
   *
   * @example ["/culture-content/img_000001.png", "/culture-content/img_000002.png"]
   */
  public imgList: string[];

  /**
   * 요금 여부
   *
   * @example true
   */
  public isFee: boolean;

  /**
   * 예약 필수 여부
   *
   * @example false
   */
  public isReservation: boolean;

  /**
   * 반려동물 입장 가능 여부
   *
   * @example true
   */
  public isPet: boolean;

  /**
   * 주차 가능 여부
   *
   * @example true
   */
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

  constructor(data: ContentEntity) {
    super(data);
    Object.assign(this, data);
  }

  static createEntity(data: CotnentWithInclude, totalSumStar?: number) {
    return new ContentEntity({
      idx: data.idx,
      title: data.title,
      thumbnail: data.ContentImg[0]?.imgPath || null,
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
