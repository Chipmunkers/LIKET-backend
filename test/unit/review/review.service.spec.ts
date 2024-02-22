import { Test, TestingModule } from '@nestjs/testing';
import { ReviewService } from '../../../src/api/reveiw/review.service';
import { PrismaService } from '../../../src/common/prisma/prisma.service';
import { ReviewNotFoundException } from '../../../src/api/reveiw/exception/ReviewNotFoundException';
import { CreateReviewDto } from '../../../src/api/reveiw/dto/CreateReviewDto';
import { ContentNotFoundException } from '../../../src/api/culture-content/exception/ContentNotFound';

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
    });

    expect(prismaMock.review.findUnique).toHaveBeenCalledTimes(1);
    await expect(service.getReviewByIdx(1)).resolves.not.toBeUndefined();
  });

  it('getReviewByIdx fail', async () => {
    // review not found
    prismaMock.review.findUnique = jest.fn().mockResolvedValue(null);

    await expect(service.getReviewByIdx(1)).rejects.toThrow(
      ReviewNotFoundException,
    );
  });

  it('createReview success', async () => {
    // 1. check culture content state
    prismaMock.cultureContent.findUnique = jest.fn().mockResolvedValue({
      idx: 1,
      acceptedAt: new Date(),
    });

    expect(prismaMock.cultureContent.findUnique).toHaveBeenCalledTimes(1);
    await expect(
      service.createReview(1, 1, {} as CreateReviewDto),
    ).resolves.toBeUndefined();
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
});
