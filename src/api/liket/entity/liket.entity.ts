import { Prisma } from '@prisma/client';
import { SummaryLiketEntity } from './summary-liket.entity';
import { LocationEntity } from '../../culture-content/entity/location.entity';
import { TagEntity } from '../../content-tag/entity/tag.entity';

const liketWithInclude = Prisma.validator<Prisma.LiketDefaultArgs>()({
  include: {
    Review: {
      include: {
        CultureContent: {
          include: {
            Genre: true,
            Location: true,
            ContentImg: true,
          },
        },
        ReviewImg: true,
      },
    },
    User: true,
  },
});

type LiketWithInclude = Prisma.LiketGetPayload<typeof liketWithInclude>;

export class LiketEntity extends SummaryLiketEntity {
  /**
   * 라이켓 내용
   *
   * @example "낮엔 되게 비싸보이는데\n밤엔 엄청 비싸보이는 디올"
   */
  public description: string;

  constructor(data: LiketEntity) {
    super(data);
    Object.assign(this, data);
  }

  static createEntity(liket: LiketWithInclude) {
    const review = liket.Review;
    const content = review.CultureContent;
    const author = liket.User;

    return new LiketEntity({
      idx: liket.idx,
      imgPath: liket.imgPath,
      description: liket.description,
      review: {
        idx: review.idx,
        starRating: review.starRating,
        visitTime: review.visitTime,
        thumbnail: review.ReviewImg[0]?.imgPath || '',
        createdAt: review.createdAt,
      },
      cultureContent: {
        idx: content.idx,
        title: content.title,
        genre: TagEntity.createEntity(content.Genre),
        location: LocationEntity.createEntity(content.Location),
        thumbnail: content.ContentImg[0]?.imgPath || '',
      },
      author: {
        idx: author.idx,
        nickname: author.nickname,
        profileImgPath: author.profileImgPath,
        provider: author.provider,
      },
      createdAt: liket.createdAt,
    });
  }
}
