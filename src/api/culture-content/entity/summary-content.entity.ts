import { Prisma } from '@prisma/client';
import { TagEntity } from '../../content-tag/entity/tag.entity';
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

export class SummaryContentEntity {
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
  public title: string;

  /**
   * 컨텐츠 썸네일
   *
   * @example /culture-content/img_00001.png
   */
  public thumbnail: string | null;

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
  public startDate: Date;

  /**
   * 끝나는 날짜
   *
   * @example 2024-05-07T00:00:00.000Z
   */
  public endDate: Date;

  /**
   * 로그인 사용자의 좋아요 상태
   */
  public likeState: boolean;

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

  constructor(data: SummaryContentEntity) {
    Object.assign(this, data);
  }

  static createEntity(data: CotnentWithInclude) {
    return new SummaryContentEntity({
      idx: data.idx,
      title: data.title,
      thumbnail: data.ContentImg[0]?.imgPath || null,
      genre: TagEntity.createEntity(data.Genre),
      style: data.Style.map((style) => TagEntity.createEntity(style.Style)),
      age: TagEntity.createEntity(data.Age),
      location: LocationEntity.createEntity(data.Location),
      startDate: data.startDate,
      endDate: data.endDate,
      likeState: data.ContentLike[0] ? true : false,
      createdAt: data.createdAt,
      acceptedAt: data.acceptedAt,
    });
  }
}
