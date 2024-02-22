import { Test, TestingModule } from '@nestjs/testing';
import { ReviewService } from '../../../src/api/reveiw/review.service';
import { PrismaService } from '../../../src/common/prisma/prisma.service';
import { ReviewNotFoundException } from '../../../src/api/reveiw/exception/ReviewNotFoundException';

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
});
