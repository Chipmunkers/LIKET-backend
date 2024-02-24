import { Test, TestingModule } from '@nestjs/testing';
import { BannerService } from '../../../src/api/banner/banner.service';
import { PrismaService } from '../../../src/common/prisma/prisma.service';
import { BannerEntity } from '../../../src/api/banner/entity/BannerEntity';
import { BannerNotFoundException } from '../../../src/api/banner/exception/BannerNotFoundException';
import { ConflictException } from '@nestjs/common';
import { UpdateBannerDto } from '../../../src/api/banner/dto/UpdateBannerDto';

describe('BannerService', () => {
  let service: BannerService;
  let prismaMock: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BannerService,
        {
          provide: PrismaService,
          useValue: {
            banner: {},
            activeBanner: {},
          },
        },
      ],
    }).compile();

    service = module.get<BannerService>(BannerService);
    prismaMock = module.get<PrismaService>(PrismaService);
  });

  it('getBannerAll success', async () => {
    // 1. get active banner all with prisma
    prismaMock.activeBanner.findMany = jest.fn().mockResolvedValue([]);

    await expect(service.getBannerAll()).resolves.toBeInstanceOf(
      BannerEntity<'active'>,
    );
    expect(prismaMock.activeBanner.findMany).toHaveBeenCalledTimes(1);
  });

  it('getBannerAllForAdmin success', async () => {
    // 1. get banner all with prisma
    prismaMock.banner.findMany = jest.fn().mockResolvedValue([]);

    const result = await service.getBannerAllForAdmin({
      page: 1,
      order: 'desc',
    });

    for (const banner of result.bannerList) {
      expect(banner).toBeInstanceOf(BannerEntity);
    }
    expect(prismaMock.banner.findMany).toHaveBeenCalledTimes(1);
  });

  it('getBannerByIdxForAdmin success', async () => {
    prismaMock.banner.findUnique = jest.fn().mockResolvedValue({
      idx: 1,
    });

    await expect(service.getBannerByIdxForAdmin(1)).resolves.toBeInstanceOf(
      BannerEntity<'all'>,
    );
    expect(prismaMock.banner.findUnique).toHaveBeenCalledTimes(1);
  });

  it('getBannerByIdxForAdmin fail - not found', async () => {
    prismaMock.banner.findUnique = jest.fn().mockResolvedValue(null);

    await expect(service.getBannerByIdxForAdmin(1)).rejects.toThrow(
      BannerNotFoundException,
    );
    expect(prismaMock.banner.findUnique).toHaveBeenCalledTimes(1);
  });

  it('updateBanner success', async () => {
    // 1. find banner via prisma
    prismaMock.banner.findUnique = jest.fn().mockResolvedValue({ idx: 1 });

    // 2. update banner
    prismaMock.banner.update = jest.fn().mockResolvedValue({});

    await expect(
      service.updateBanner(1, {} as UpdateBannerDto),
    ).resolves.toBeUndefined();
    expect(prismaMock.banner.findUnique).toHaveBeenCalledTimes(1);
    expect(prismaMock.banner.update).toHaveBeenCalledTimes(1);
  });

  it('udpateBanner fail - banner not found', async () => {
    // not found banner
    prismaMock.banner.findUnique = jest.fn().mockResolvedValue(null);

    await expect(
      service.updateBanner(1, {} as UpdateBannerDto),
    ).rejects.toThrow(BannerNotFoundException);
  });

  it('deleteBanner success', async () => {
    // 1. find banner with prisma
    prismaMock.banner.findUnique = jest
      .fn()
      .mockResolvedValue({ idx: 1, ActiveBanner: null });

    // 2. excute transaction ( delete banner )
    prismaMock.$transaction = jest.fn().mockResolvedValue({});

    await expect(service.deleteBanner(1)).resolves.toBeUndefined();
    expect(prismaMock.banner.findUnique).toHaveBeenCalledTimes(1);
    expect(prismaMock.$transaction).toHaveBeenCalledTimes(1);
  });

  it('deleteBanner fail - banner not found', async () => {
    // banner not ounf
    prismaMock.banner.findUnique = jest.fn().mockResolvedValue(null);

    await expect(service.deleteBanner(1)).rejects.toThrow(
      BannerNotFoundException,
    );
  });

  it('deleteBanner fail - active banner', async () => {
    // active banner
    prismaMock.banner.findUnique = jest
      .fn()
      .mockResolvedValue({ idx: 1, ActiveBanner: { idx: 1 } });

    await expect(service.deleteBanner(1)).rejects.toThrow(ConflictException);
  });
});
