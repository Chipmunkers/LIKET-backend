import { Test, TestingModule } from '@nestjs/testing';
import { CultureContentService } from '../../../src/api/culture-content/culture-content.service';
import { PrismaService } from '../../../src/common/prisma/prisma.service';
import { AuthService } from '../../../src/api/auth/auth.service';
import { ContentNotFoundException } from '../../../src/api/culture-content/exception/ContentNotFound';

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
});
