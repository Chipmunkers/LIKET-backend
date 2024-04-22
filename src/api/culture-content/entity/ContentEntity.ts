import { Prisma } from '@prisma/client';
import { LocationEntity } from './LocationEntity';
import { TagEntity } from './TagEntity';
import { ValidateNested } from 'class-validator';
import { UserProfileEntity } from '../../user/entity/UserProfileEntity';

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

export class ContentEntity<
  T extends 'summary' | 'detail' = 'detail',
  K extends 'author' | undefined = undefined,
> {
  idx: number;
  title: string;
  thumbnail: string | null;

  @ValidateNested()
  genre: TagEntity;

  @ValidateNested()
  style: TagEntity[];

  @ValidateNested()
  age: TagEntity;

  @ValidateNested()
  location: LocationEntity;

  startDate: Date;
  endDate: Date;

  openTime: T extends 'detail' ? string : undefined;
  description: T extends 'detail' ? string : undefined;
  websiteLink: T extends 'detail' ? string : undefined;
  imgList: T extends 'detail' ? string[] : undefined;
  isFee: T extends 'detail' ? boolean : undefined;
  isReservation: T extends 'detail' ? boolean : undefined;
  isPet: T extends 'detail' ? boolean : undefined;
  isParking: T extends 'detail' ? boolean : undefined;
  likeCount: T extends 'detail' ? number : undefined;
  reviewCount: T extends 'detail' ? number : undefined;

  author: K extends 'author' ? UserProfileEntity : undefined;
  likeState: boolean;
  avgStarRating: T extends 'detail' ? number : undefined;

  createdAt: Date;

  constructor(
    data: {
      idx: number;
      title: string;
      thumbnail: string | null;
      genre: TagEntity;
      style: TagEntity[];
      age: TagEntity;
      location: LocationEntity;
      startDate: Date;
      endDate: Date;
      createdAt: Date;

      openTime: T extends 'detail' ? string : undefined;
      description: T extends 'detail' ? string : undefined;
      websiteLink: T extends 'detail' ? string : undefined;
      imgList: T extends 'detail' ? string[] : undefined;
      isFee: T extends 'detail' ? boolean : undefined;
      isReservation: T extends 'detail' ? boolean : undefined;
      isPet: T extends 'detail' ? boolean : undefined;
      isParking: T extends 'detail' ? boolean : undefined;
      likeCount: T extends 'detail' ? number : undefined;
      reviewCount: T extends 'detail' ? number : undefined;

      author: K extends 'author' ? UserProfileEntity : undefined;
      likeState: boolean;
    },
    avgStarRating: T extends 'detail' ? number : undefined,
  ) {
    this.idx = data.idx;
    this.title = data.title;
    this.thumbnail = data.thumbnail;
    this.genre = data.genre;
    this.style = data.style;
    this.age = data.age;
    this.location = data.location;
    this.startDate = data.startDate;
    this.endDate = data.endDate;
    this.openTime = data.openTime;
    this.description = data.description;
    this.websiteLink = data.websiteLink;
    this.imgList = data.imgList;
    this.isFee = data.isFee;
    this.isReservation = data.isReservation;
    this.isPet = data.isPet;
    this.isParking = data.isParking;
    this.likeCount = data.likeCount;
    this.author = data.author;
    this.likeState = data.likeState;
    this.avgStarRating = avgStarRating;
    this.reviewCount = data.reviewCount;
    this.createdAt = data.createdAt;
  }

  static createUserSummaryContent(
    data: CotnentWithInclude,
  ): ContentEntity<'summary'> {
    return new ContentEntity<'summary'>(
      {
        idx: data.idx,
        title: data.title,
        thumbnail: data.ContentImg[0]?.imgPath || null,
        genre: TagEntity.createTag(data.Genre),
        style: data.Style.map((style) => TagEntity.createTag(style.Style)),
        age: TagEntity.createTag(data.Age),
        location: LocationEntity.createDetailLocation(data.Location),
        startDate: data.startDate,
        endDate: data.endDate,
        openTime: undefined,
        description: undefined,
        websiteLink: undefined,
        imgList: undefined,
        isFee: undefined,
        isReservation: undefined,
        isPet: undefined,
        isParking: undefined,
        likeCount: undefined,
        author: undefined,
        likeState: data.ContentLike[0] ? true : false,
        reviewCount: undefined,
        createdAt: data.createdAt,
      },
      undefined,
    );
  }

  static createUserDetailContent(
    data: CotnentWithInclude,
    totalSumStar: number,
  ): ContentEntity<'detail'> {
    return new ContentEntity<'detail'>(
      {
        idx: data.idx,
        title: data.title,
        thumbnail: data.ContentImg[0]?.imgPath || null,
        genre: TagEntity.createTag(data.Genre),
        style: data.Style.map((style) => TagEntity.createTag(style.Style)),
        age: TagEntity.createTag(data.Age),
        location: LocationEntity.createDetailLocation(data.Location),
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
        author: undefined,
        likeState: data.ContentLike[0] ? true : false,
        reviewCount: data._count.Review,
        createdAt: data.createdAt,
      },
      totalSumStar / data._count.Review,
    );
  }

  static createSummaryContentWithAuthor(
    data: CotnentWithInclude,
    totalSumStar: number,
  ) {
    return new ContentEntity<'detail', 'author'>(
      {
        idx: data.idx,
        title: data.title,
        thumbnail: data.ContentImg[0]?.imgPath || null,
        genre: TagEntity.createTag(data.Genre),
        style: data.Style.map((style) => TagEntity.createTag(style.Style)),
        age: TagEntity.createTag(data.Age),
        location: LocationEntity.createDetailLocation(data.Location),
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
        author: UserProfileEntity.createUserProfileEntity(data.User),
        likeState: data.ContentLike[0] ? true : false,
        reviewCount: data._count.Review,
        createdAt: data.createdAt,
      },
      totalSumStar / data._count.Review,
    );
  }
}
