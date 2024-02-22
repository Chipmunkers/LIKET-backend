import { Test, TestingModule } from '@nestjs/testing';
import { CultureContentService } from '../../../src/api/culture-content/culture-content.service';
import { PrismaService } from '../../../src/common/prisma/prisma.service';
import { AuthService } from '../../../src/api/auth/auth.service';
import { ContentNotFoundException } from '../../../src/api/culture-content/exception/ContentNotFound';
import { CreateContentRequestDto } from '../../../src/api/culture-content/dto/CreateContentRequestDto';
import { UpdateContentDto } from '../../../src/api/culture-content/dto/UpdateContentDto';
import { ForbiddenException } from '@nestjs/common';
import { AlreadyLikeContentException } from '../../../src/api/culture-content/exception/AlreadyLikeContentException';

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
    });

    await expect(service.getContentByIdx(1, 1)).resolves.not.toBeUndefined();
  });

  it('getContentByIdx fail - not found content', async () => {
    // fail to find culture content
    prismaMock.cultureContent.findUnique = jest.fn().mockResolvedValue(null);

    await expect(service.getContentByIdx(1, 1)).rejects.toThrow(
      ContentNotFoundException,
    );
  });

  it('getContentRequestByIdx success', async () => {
    // 1. get culture content request with prisma
    prismaMock.cultureContent.findUnique = jest.fn().mockResolvedValue({
      idx: 1,
    });

    await expect(
      service.getContentRequestByIdx(1),
    ).resolves.not.toBeUndefined();
  });

  it('getContentRequestByIdx fail - not found content request', async () => {
    // fail to find
    prismaMock.cultureContent.findUnique = jest.fn().mockResolvedValue(null);

    await expect(service.getContentRequestByIdx(1)).rejects.toThrow(
      ContentNotFoundException,
    );
  });

  it('updateContentRequest success', async () => {
    // 1. check cutlure content request state
    prismaMock.cultureContent.findUnique = jest.fn().mockResolvedValue({
      idx: 1,
      acceptedAt: null,
    });

    // 2. update culture content
    prismaMock.cultureContent.update = jest.fn().mockResolvedValue({});

    await expect(
      service.updateContentRequest(1, {} as UpdateContentDto),
    ).resolves.toBeUndefined();
  });

  it('updateContentRequest fail - accpeted content', async () => {
    // acceptd content
    prismaMock.cultureContent.findUnique = jest.fn().mockResolvedValue({
      idx: 1,
      acceptedAt: new Date(),
    });

    await expect(
      service.updateContentRequest(1, {} as UpdateContentDto),
    ).rejects.toThrow(ForbiddenException);
  });

  it('updateContentRequest fail - content not found', async () => {
    // content not found
    prismaMock.cultureContent.findUnique = jest.fn().mockResolvedValue(null);

    await expect(
      service.updateContentRequest(1, {} as UpdateContentDto),
    ).rejects.toThrow(ContentNotFoundException);
  });

  it('deleteContentRequest success', async () => {
    // 1. delete culture content request state
    prismaMock.cultureContent.findUnique = jest.fn().mockResolvedValue({
      idx: 1,
      acceptedAt: null,
    });

    // 2. delete culture content
    prismaMock.cultureContent.update = jest.fn().mockResolvedValue({});

    await expect(service.deleteContentRequest(1)).resolves.toBeUndefined();
  });

  it('deleteContentRequest fail - accepted content', async () => {
    // accepted content
    prismaMock.cultureContent.findUnique = jest.fn().mockResolvedValue({
      idx: 1,
      acceptedAt: new Date(),
    });

    await expect(service.deleteContentRequest(1)).rejects.toThrow(
      ForbiddenException,
    );
  });

  it('deleteContentRequest fail - content not found', async () => {
    // content not found
    prismaMock.cultureContent.findUnique = jest.fn().mockResolvedValue(null);

    await expect(service.deleteContentRequest(1)).rejects.toThrow(
      ContentNotFoundException,
    );
  });

  it('acceptContentRequest success', async () => {
    // 1. check content request state
    prismaMock.cultureContent.findUnique = jest.fn().mockResolvedValue({
      idx: 1,
      acceptedAt: null,
    });

    await expect(service.acceptContentRequest(1)).resolves.toBeUndefined();
  });

  it('acceptContentRequest fail - accepted content', async () => {
    // accepted content
    prismaMock.cultureContent.findUnique = jest.fn().mockResolvedValue({
      idx: 1,
      acceptedAt: new Date(),
    });

    await expect(service.acceptContentRequest(1)).rejects.toThrow(
      ForbiddenException,
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

    expect(prismaMock.cultureContent.findUnique).toHaveBeenCalledTimes(1);
    await expect(service.deactivateContent(1)).resolves.toBeUndefined();
  });

  it('deactivateContent fail - already deactivated content', async () => {
    // already deactivated content
    prismaMock.cultureContent.findUnique = jest.fn().mockResolvedValue({
      idx: 1,
      acceptedAt: null,
    });

    await expect(service.deactivateContent(1)).rejects.toThrow(
      ForbiddenException,
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

    expect(prismaMock.contentLike.findUnique).toHaveBeenCalledTimes(1);
    await expect(service.likeContent(1, 1)).resolves.toBeUndefined();
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
});
