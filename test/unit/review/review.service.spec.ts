import { Test, TestingModule } from '@nestjs/testing';
import { ReviewService } from '../../../src/api/review/review.service';
import { PrismaService } from '../../../src/prisma/prisma.service';
import { ReviewNotFoundException } from '../../../src/api/review/exception/ReviewNotFoundException';
import { CreateReviewDto } from '../../../src/api/culture-content/dto/create-review.dto';
import { ContentNotFoundException } from '../../../src/api/culture-content/exception/ContentNotFound';
import { ReviewEntity } from '../../../src/api/review/entity/summary-review.entity';
import { AlreadyLikeReviewException } from '../../../src/api/review/exception/AlreadyLikeReviewException';
import { AlreadyNotLikeReviewExcpetion } from '../../../src/api/review/exception/AlreadyNotLikeReviewException';

describe('ReviewService', () => {
  let service: ReviewService;
  let prismaMock: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ReviewService,
        {
          provide: PrismaService,
          useValue: {
            review: {},
            cultureContent: {},
            reviewLike: {},
          },
        },
      ],
    }).compile();

    service = module.get<ReviewService>(ReviewService);
    prismaMock = module.get<PrismaService>(PrismaService);
  });

  it('getReviewByIdx success', async () => {
    // 1. get review with prisma
    prismaMock.review.findUnique = jest.fn().mockResolvedValue({
      idx: 1,
      author: {},
      CultureContent: {
        Genre: {},
        ContentImg: [],
      },
      ReviewImg: [],
      User: {},
      ReviewLike: [],
    });

    await expect(service.getReviewByIdx(1, 1)).resolves.toBeInstanceOf(
      ReviewEntity<'detail'>,
    );
    expect(prismaMock.review.findUnique).toHaveBeenCalledTimes(1);
  });

  it('getReviewByIdx fail', async () => {
    // review not found
    prismaMock.review.findUnique = jest.fn().mockResolvedValue(null);

    await expect(service.getReviewByIdx(1, 1)).rejects.toThrow(
      ReviewNotFoundException,
    );
  });

  it('createReview success', async () => {
    // 1. check culture content state
    prismaMock.cultureContent.findUnique = jest.fn().mockResolvedValue({
      idx: 1,
      acceptedAt: new Date(),
    });

    // 2. create review
    prismaMock.review.create = jest.fn().mockResolvedValue({});

    await expect(
      service.createReview(1, 1, {
        imgList: [],
        description: '',
        starRating: 3,
        visitTime: new Date().toString(),
      }),
    ).resolves.toBeUndefined();
    expect(prismaMock.cultureContent.findUnique).toHaveBeenCalledTimes(1);
    expect(prismaMock.review.create).toHaveBeenCalledTimes(1);
  });

  it('createReview fail - not found cultureContent', async () => {
    // not found content
    prismaMock.cultureContent.findUnique = jest.fn().mockResolvedValue(null);

    await expect(
      service.createReview(1, 1, {} as CreateReviewDto),
    ).rejects.toThrow(ContentNotFoundException);
  });

  it('createReview fail - not activate cultureContent', async () => {
    // not activate
    prismaMock.cultureContent.findUnique = jest.fn().mockResolvedValue({
      idx: 1,
      acceptedAt: null,
    });

    await expect(
      service.createReview(1, 1, {} as CreateReviewDto),
    ).rejects.toThrow(ContentNotFoundException);
  });

  it('likeReview success', async () => {
    // 1. check review like state
    prismaMock.reviewLike.findUnique = jest.fn().mockResolvedValue(null);

    // 2. like review
    prismaMock.$transaction = jest
      .fn()
      .mockResolvedValue(async (taskList: Promise<any>[]) => {
        for (const task of taskList) await task;
      });
    prismaMock.reviewLike.create = jest.fn().mockResolvedValue({});
    prismaMock.review.update = jest.fn().mockResolvedValue({});

    await expect(service.likeReview(1, 1)).resolves.toBeUndefined();
    expect(prismaMock.reviewLike.findUnique).toHaveBeenCalledTimes(1);
    expect(prismaMock.reviewLike.create).toHaveBeenCalledTimes(1);
    expect(prismaMock.review.update).toHaveBeenCalledTimes(1);
  });

  it('likeReview fail - already like review', async () => {
    // already like
    prismaMock.reviewLike.findUnique = jest.fn().mockResolvedValue({
      userIdx: 1,
      reviewIdx: 1,
      createdAt: new Date(),
    });

    await expect(service.likeReview(1, 1)).rejects.toThrow(
      AlreadyLikeReviewException,
    );
  });

  it('cancelToLikeReview success', async () => {
    // 1. get review like state
    prismaMock.reviewLike.findUnique = jest.fn().mockResolvedValue({
      userIdx: 1,
      reviewIdx: 1,
      createdAt: new Date(),
    });

    // 2. delete review like
    prismaMock.$transaction = jest
      .fn()
      .mockResolvedValue(async (taskList: Promise<any>[]) => {
        for (const task of taskList) await task;
      });
    prismaMock.reviewLike.delete = jest.fn().mockResolvedValue({});
    prismaMock.review.update = jest.fn().mockResolvedValue({});

    await expect(service.cancelToLikeReview(1, 1)).resolves.toBeUndefined();
    expect(prismaMock.reviewLike.findUnique).toHaveBeenCalledTimes(1);
    expect(prismaMock.reviewLike.delete).toHaveBeenCalledTimes(1);
    expect(prismaMock.review.update).toHaveBeenCalledTimes(1);
  });

  it('cancelToLikeReview fail - already do not like', async () => {
    // already do not like review
    prismaMock.reviewLike.findUnique = jest.fn().mockResolvedValue(null);

    await expect(service.cancelToLikeReview(1, 1)).rejects.toThrow(
      AlreadyNotLikeReviewExcpetion,
    );
  });
});
