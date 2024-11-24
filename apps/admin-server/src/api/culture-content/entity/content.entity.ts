import { Prisma } from '@prisma/client';
import { UserEntity } from '../../user/entity/user.entity';
import { LocationEntity } from './location.entity';
import { TagEntity } from './tag.entity';
import { SummaryContentEntity } from './summary-content.entity';

const ContentWithInclude = Prisma.validator<Prisma.CultureContentDefaultArgs>()({
  include: {
    User: {
      include: {
        BlockReason: true,
      },
    },
    ContentImg: true,
    Genre: true,
    Style: {
      include: {
        Style: true,
      },
    },
    Age: true,
    Location: true,
  },
});

type CotnentWithInclude = Prisma.CultureContentGetPayload<typeof ContentWithInclude>;

export class ContentEntity extends SummaryContentEntity {
  /**
   * 오픈 시간
   *
   * @example "월-금 12:00-20:00 토-일 11:00-20:00"
   */
  public openTime: string;

  /**
   * 컨텐츠 설명
   *
   * @example "성수 디올 팝업스토어는 어떤 곳이고\n어떤 이벤트가 진행중입니다."
   */
  public description: string;

  /**
   * 웹 사이트 링크
   *
   * @example https://www.dior.com/ko_kr/fashion
   */
  public websiteLink: string;

  constructor(data: ContentEntity) {
    super(data);
    Object.assign(this, data);
  }

  static createEntity(content: CotnentWithInclude) {
    return new ContentEntity({
      idx: content.idx,
      title: content.title,
      imgList: content.ContentImg.map((img) => img.imgPath),
      genre: TagEntity.createEntity(content.Genre),
      startDate: content.startDate,
      endDate: content.endDate,
      user: UserEntity.createEntity(content.User),
      age: TagEntity.createEntity(content.Age),
      styleList: content.Style.map((style) => TagEntity.createEntity(style.Style)),
      location: LocationEntity.createEntity(content.Location),
      createdAt: content.createdAt,
      acceptedAt: content.acceptedAt,
      openTime: content.openTime,
      description: content.description,
      websiteLink: content.websiteLink,
      isFee: content.isFee,
      isReservation: content.isReservation,
      isPet: content.isPet,
      isParking: content.isParking,
    });
  }
}
