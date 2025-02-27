import { Prisma } from '@prisma/client';
import { UserEntity } from '../../user/entity/user.entity';
import { TagEntity } from './tag.entity';
import { LocationEntity } from './location.entity';

const ContentWithInclude = Prisma.validator<Prisma.CultureContentDefaultArgs>()(
  {
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
  },
);

type ContentWithInclude = Prisma.CultureContentGetPayload<
  typeof ContentWithInclude
>;

export class SummaryContentEntity {
  /**
   * 문화생활컨텐츠 인덱스
   *
   * @example 83
   */
  public idx: number;

  /**
   * 문화생활컨텐츠 제목
   *
   * @example
   */
  public title: string;

  /**
   * 이미지 경로 배열
   *
   * @example ['https://s3.ap-northeast-2.liket/culture-content/img_012842.png', 'https://s3.ap-northeast-2.liket/culture-content/img_783018.png']
   */
  public imgList: string[];

  /**
   * 장르
   */
  public genre: TagEntity;

  /**
   * 시작일
   *
   * @example 2024-02-28T12:00:00.000Z
   */
  public startDate: Date;

  /**
   * 시작일
   *
   * @example 2024-02-28T12:00:00.000Z
   */
  public endDate: Date | null;

  /**
   * 등록한 사용자
   */
  public user: UserEntity;

  /**
   * 연령대
   */
  public age: TagEntity;

  /**
   * 스타일
   */
  public styleList: TagEntity[];

  /**
   * 위치
   */
  public location: LocationEntity;

  /**
   * 생성일 (등록일)
   *
   * @exmaple 2024-02-24T12:12:10.000Z
   */
  public createdAt: Date;

  /**
   * 활성화 날짜
   *
   * @exmaple 2024-02-24T12:12:10.000Z
   */
  public acceptedAt: Date | null;

  /**
   * 입장료 여부
   *
   * @example false
   */
  public isFee: boolean;

  /**
   * 예약 여부
   *
   * @example true
   */
  public isReservation: boolean;

  /**
   * 반려동물 가능 여부
   *
   * @example true
   */
  public isPet: boolean;

  /**
   * 주차 가능 여부
   *
   * @example false
   */
  public isParking: boolean;

  /**
   * Id
   *
   * @example KP-PF123123
   */
  public id: string | null;

  constructor(data: SummaryContentEntity) {
    Object.assign(this, data);
  }

  static createEntity(content: ContentWithInclude) {
    return new SummaryContentEntity({
      idx: content.idx,
      title: content.title,
      imgList: content.ContentImg.map((img) => img.imgPath),
      genre: TagEntity.createEntity(content.Genre),
      startDate: content.startDate,
      endDate: content.endDate,
      user: UserEntity.createEntity(content.User),
      age: TagEntity.createEntity(content.Age),
      styleList: content.Style.map((style) =>
        TagEntity.createEntity(style.Style),
      ),
      location: LocationEntity.createEntity(content.Location),
      createdAt: content.createdAt,
      acceptedAt: content.acceptedAt,
      isFee: content.isFee,
      isReservation: content.isReservation,
      isPet: content.isPet,
      isParking: content.isParking,
      id: content.id,
    });
  }
}
