import { Test, TestingModule } from '@nestjs/testing';
import { CultureContentService } from '../../../src/api/culture-content/culture-content.service';
import { PrismaService } from '../../../src/common/prisma/prisma.service';
import { ContentNotFoundException } from '../../../src/api/culture-content/exception/ContentNotFound';
import { UpdateContentDto } from '../../../src/api/culture-content/dto/UpdateContentDto';
import { ConflictException, ForbiddenException } from '@nestjs/common';
import { AlreadyLikeContentException } from '../../../src/api/culture-content/exception/AlreadyLikeContentException';
import { AlreadyNotLikeContentException } from '../../../src/api/culture-content/exception/AlreadyNotLikeContentException';
import { ContentEntity } from '../../../src/api/culture-content/entity/ContentEntity';
import { CreateLocationDto } from '../../../src/common/dto/CreateLocationDto';

describe('CultureContentService', () => {
  let service: CultureContentService;
  let prismaMock: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CultureContentService,
        {
          provide: PrismaService,
          useValue: {
            cultureContent: {},
            contentLike: {},
            review: {
              aggregate: {},
            },
            location: {},
          },
        },
      ],
    }).compile();

    service = module.get<CultureContentService>(CultureContentService);
    prismaMock = module.get<PrismaService>(PrismaService);
  });

  it('getContentByIdx success', async () => {
    // 1. get culture content with prisma
    prismaMock.cultureContent.findUnique = jest.fn().mockResolvedValue({
      idx: 1,
      ContentImg: [],
      Genre: {},
      Age: {},
      Style: [],
      ContentLike: [],
      Location: {},
      _count: 0,
    });

    // 2. get content review start sum
    prismaMock.review.aggregate = jest.fn().mockResolvedValue({
      _sum: {
        starRating: 10,
      },
    });

    await expect(service.getContentByIdx(1, 1)).resolves.toBeInstanceOf(
      ContentEntity<'detail', 'user'>,
    );
    expect(prismaMock.cultureContent.findUnique).toHaveBeenCalledTimes(1);
    expect(prismaMock.review.aggregate).toHaveBeenCalledTimes(1);
  });

  it('getContentByIdx fail - not found content', async () => {
    // fail to find culture content
    prismaMock.cultureContent.findUnique = jest.fn().mockResolvedValue(null);

    prismaMock.review.aggregate = jest.fn().mockResolvedValue(null);

    await expect(service.getContentByIdx(1, 1)).rejects.toThrow(
      ContentNotFoundException,
    );
  });

  it('getContentRequestByIdx success', async () => {
    // 1. get culture content request with prisma
    prismaMock.cultureContent.findUnique = jest.fn().mockResolvedValue({
      idx: 1,
      ContentImg: [],
      Genre: {},
      Age: {},
      Style: [],
      ContentLike: [],
      Location: {},
      User: {},
      _count: 0,
    });

    // 2. get review starRating
    prismaMock.review.aggregate = jest.fn().mockResolvedValue({
      _sum: {
        starRating: 10,
      },
    });

    await expect(service.getContentRequestByIdx(1)).resolves.toBeInstanceOf(
      ContentEntity<'detail', 'admin'>,
    );
    expect(prismaMock.cultureContent.findUnique).toHaveBeenCalledTimes(1);
  });

  it('getContentRequestByIdx fail - not found content request', async () => {
    // fail to find
    prismaMock.cultureContent.findUnique = jest.fn().mockResolvedValue(null);
    prismaMock.review.aggregate = jest.fn().mockResolvedValue(null);

    await expect(service.getContentRequestByIdx(1)).rejects.toThrow(
      ContentNotFoundException,
    );
  });

  it('updateContentRequest success', async () => {
    // 1. update culture content with transaction
    prismaMock.$transaction = jest.fn().mockImplementation(async (list) => {
      list.map(async (task) => await task);
    });
    prismaMock.cultureContent.update = jest.fn().mockResolvedValue({});
    prismaMock.location.update = jest.fn().mockResolvedValue({});

    await expect(
      service.updateContentRequest(1, {
        title: '',
        description: '',
        websiteLink: '',
        startDate: '',
        endDate: '',
        openTime: '',
        location: {} as CreateLocationDto,
        genreIdx: 1,
        styleIdxList: [],
        ageIdx: 1,
        isFee: true,
        isParking: true,
        isReservation: true,
        isPet: true,
        imgList: [],
      }),
    ).resolves.toBeUndefined();
    expect(prismaMock.$transaction).toHaveBeenCalledTimes(1);
    expect(prismaMock.cultureContent.update).toHaveBeenCalledTimes(1);
    expect(prismaMock.location.update).toHaveBeenCalledTimes(1);
  });

  it('deleteContentRequest success', async () => {
    // 1. delete culture content
    prismaMock.cultureContent.update = jest.fn().mockResolvedValue({});

    await expect(service.deleteContentRequest(1)).resolves.toBeUndefined();
    expect(prismaMock.cultureContent.update).toHaveBeenCalledTimes(1);
  });

  it('acceptContentRequest success', async () => {
    // 1. check content request state
    prismaMock.cultureContent.findUnique = jest.fn().mockResolvedValue({
      idx: 1,
      acceptedAt: null,
    });

    // 2. update content to accept
    prismaMock.cultureContent.update = jest.fn().mockResolvedValue({});

    await expect(service.acceptContentRequest(1)).resolves.toBeUndefined();
    expect(prismaMock.cultureContent.findUnique).toHaveBeenCalledTimes(1);
    expect(prismaMock.cultureContent.update).toHaveBeenCalledTimes(1);
  });

  it('acceptContentRequest fail - accepted content', async () => {
    // accepted content
    prismaMock.cultureContent.findUnique = jest.fn().mockResolvedValue({
      idx: 1,
      acceptedAt: new Date(),
    });

    await expect(service.acceptContentRequest(1)).rejects.toThrow(
      ConflictException,
    );
  });

  it('acceptContentRequest fail - not found content', async () => {
    // not found content
    prismaMock.cultureContent.findUnique = jest.fn().mockResolvedValue(null);

    await expect(service.acceptContentRequest(1)).rejects.toThrow(
      ContentNotFoundException,
    );
  });

  it('deactivateContent success', async () => {
    // 1. check content request state
    prismaMock.cultureContent.findUnique = jest.fn().mockResolvedValue({
      idx: 1,
      acceptedAt: new Date(),
    });

    // 2. update content
    prismaMock.cultureContent.update = jest.fn().mockResolvedValue({});

    await expect(service.deactivateContent(1)).resolves.toBeUndefined();
    expect(prismaMock.cultureContent.findUnique).toHaveBeenCalledTimes(1);
    expect(prismaMock.cultureContent.update).toHaveBeenCalledTimes(1);
  });

  it('deactivateContent fail - already deactivated content', async () => {
    // already deactivated content
    prismaMock.cultureContent.findUnique = jest.fn().mockResolvedValue({
      idx: 1,
      acceptedAt: null,
    });

    await expect(service.deactivateContent(1)).rejects.toThrow(
      ConflictException,
    );
  });

  it('deactivateContent fail - content not found', async () => {
    // content not found
    prismaMock.cultureContent.findUnique = jest.fn().mockResolvedValue(null);

    await expect(service.deactivateContent(1)).rejects.toThrow(
      ContentNotFoundException,
    );
  });

  it('likeContent success', async () => {
    // 1. check like state
    prismaMock.contentLike.findUnique = jest.fn().mockResolvedValue(null);

    // 2. create like
    prismaMock.$transaction = jest
      .fn()
      .mockImplementation(async (taskList: Promise<any>[]) => {
        for (const task of taskList) {
          await task;
        }
      });
    prismaMock.contentLike.create = jest.fn().mockResolvedValue({});
    prismaMock.cultureContent.update = jest.fn().mockResolvedValue({});

    await expect(service.likeContent(1, 1)).resolves.toBeUndefined();
    expect(prismaMock.contentLike.findUnique).toHaveBeenCalledTimes(1);
    expect(prismaMock.contentLike.create).toHaveBeenCalledTimes(1);
    expect(prismaMock.cultureContent.update).toHaveBeenCalledTimes(1);
  });

  it('liketContent fail - already like content', async () => {
    // already like content
    prismaMock.contentLike.findUnique = jest.fn().mockResolvedValue({
      userIdx: 1,
      contentIdx: 1,
      createdAt: new Date(),
    });

    await expect(service.likeContent(1, 1)).rejects.toThrow(
      AlreadyLikeContentException,
    );
  });

  it('cancelToLikeContent success', async () => {
    // 1. check like state
    prismaMock.contentLike.findUnique = jest.fn().mockResolvedValue({
      userIdx: 1,
      contentIdx: 1,
      createdAt: new Date(),
    });

    // 2. delete like
    prismaMock.$transaction = jest
      .fn()
      .mockImplementation(async (taskList: Promise<any>[]) => {
        for (const task of taskList) {
          await task;
        }
      });
    prismaMock.contentLike.delete = jest.fn().mockResolvedValue({});
    prismaMock.cultureContent.update = jest.fn().mockResolvedValue({});

    await expect(service.cancelToLikeContent(1, 1)).resolves.toBeUndefined();
    expect(prismaMock.contentLike.findUnique).toHaveBeenCalledTimes(1);
    expect(prismaMock.contentLike.delete).toHaveBeenCalledTimes(1);
    expect(prismaMock.$transaction).toHaveBeenCalledTimes(1);
  });

  it('cancelToLikeContent fail - already do not like', async () => {
    // already do not like
    prismaMock.contentLike.findUnique = jest.fn().mockResolvedValue(null);

    await expect(service.cancelToLikeContent(1, 1)).rejects.toThrow(
      AlreadyNotLikeContentException,
    );
  });
});
