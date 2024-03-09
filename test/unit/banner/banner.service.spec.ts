import { Test, TestingModule } from '@nestjs/testing';
import { BannerService } from '../../../src/api/banner/banner.service';
import { PrismaService } from '../../../src/prisma/prisma.service';
import { BannerEntity } from '../../../src/api/banner/entity/BannerEntity';
import { BannerNotFoundException } from '../../../src/api/banner/exception/BannerNotFoundException';
import { BadRequestException, ConflictException } from '@nestjs/common';
import { UpdateBannerDto } from '../../../src/api/banner/dto/UpdateBannerDto';
import { BannerOrderOutOfRangeException } from '../../../src/api/banner/exception/BannerOrderOutOfRangeException';
import { AlreadyActiveBannerException } from '../../../src/api/banner/exception/AlreadyActiveBannerException';
import { AlreadyDeactiveBannerException } from '../../../src/api/banner/exception/AlreadyDeactiveBannerException';
import { UploadService } from '../../../src/api/upload/upload.service';

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

    const bannerList = await service.getBannerAll();

    for (const banner of bannerList) {
      expect(banner).toBeInstanceOf(BannerEntity<'active'>);
    }
    expect(prismaMock.activeBanner.findMany).toHaveBeenCalledTimes(1);
  });

  it('getBannerAllForAdmin success', async () => {
    // 1. start transaction
    prismaMock.$transaction = jest
      .fn()
      .mockImplementation(async (taskList: Promise<any>[]) => {
        const taskResult: any[] = [];

        for (const task of taskList) {
          taskResult.push(await task);
        }

        return taskResult;
      });

    // 2. find banner all
    prismaMock.banner.findMany = jest.fn().mockResolvedValue([
      {
        idx: 1,
        imgPath: 'img/123.png',
        link: 'https://google.com',
        name: 'banner',
        createdAt: new Date(),
      },
    ]);

    // 3. get banner count
    const count = 1;
    prismaMock.banner.count = jest.fn().mockResolvedValue(count);

    const result = await service.getBannerAllForAdmin({
      page: 1,
      order: 'desc',
    });

    for (const banner of result.bannerList) {
      expect(banner).toBeInstanceOf(BannerEntity);
    }
    expect(result.count).toBe(count);
    expect(prismaMock.banner.findMany).toHaveBeenCalledTimes(1);
  });

  it('getBannerByIdxForAdmin success', async () => {
    prismaMock.banner.findUnique = jest.fn().mockResolvedValue({
      idx: 1,
      imgPath: [],
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
  });

  it('createBanner success', async () => {
    const createdBanner = { idx: 1 };
    prismaMock.banner.create = jest.fn().mockResolvedValue(createdBanner);

    await expect(
      service.createBanner({
        name: '',
        link: '',
        img: {
          filePath: '',
        },
      }),
    ).resolves.toBe(createdBanner.idx);
    expect(prismaMock.banner.create).toHaveBeenCalledTimes(1);
  });

  it('updateBanner success', async () => {
    // 1. update banner
    prismaMock.banner.update = jest.fn().mockResolvedValue({});

    await expect(
      service.updateBanner(1, {
        img: {
          filePath: '',
        },
      } as UpdateBannerDto),
    ).resolves.toBeUndefined();
    expect(prismaMock.banner.update).toHaveBeenCalledTimes(1);
  });

  it('deleteBanner success', async () => {
    // 1. start transaction
    prismaMock.$transaction = jest
      .fn()
      .mockImplementation(async (func: (tx: PrismaService) => Promise<any>) => {
        return await func(prismaMock);
      });

    // 2. find banner
    prismaMock.banner.findUnique = jest.fn().mockResolvedValue({
      idx: 1,
      ActiveBanner: {
        idx: 1,
        order: 1,
      },
    });

    // 3. delete banner by idx
    prismaMock.banner.update = jest.fn().mockResolvedValue({});

    // 4. delete active banner
    prismaMock.activeBanner.delete = jest.fn().mockResolvedValue({});

    // 5. update other banner active
    prismaMock.activeBanner.updateMany = jest.fn().mockResolvedValue({});

    await expect(service.deleteBanner(1)).resolves.toBeUndefined();
    expect(prismaMock.$transaction).toHaveBeenCalledTimes(1);
    expect(prismaMock.$transaction).toHaveBeenCalledWith(
      expect.anything(),
      expect.objectContaining({
        isolationLevel: 'RepeatableRead',
      }),
    );
    expect(prismaMock.banner.findUnique).toHaveBeenCalledTimes(1);
    expect(prismaMock.banner.update).toHaveBeenCalledTimes(1);
    expect(prismaMock.activeBanner.delete).toHaveBeenCalledTimes(1);
    expect(prismaMock.activeBanner.updateMany).toHaveBeenCalledTimes(1);
  });

  it('deleteBanner success - deactivate banner', async () => {
    // 1. start transaction
    prismaMock.$transaction = jest
      .fn()
      .mockImplementation(async (func: (tx: PrismaService) => Promise<any>) => {
        func(prismaMock);
      });

    // 2. find banner
    prismaMock.banner.findUnique = jest.fn().mockResolvedValue({
      idx: 1,
      ActiveBanner: null,
    });

    // 3. delete banner by idx
    prismaMock.banner.update = jest.fn().mockResolvedValue({});

    await expect(service.deleteBanner(1)).resolves.toBeUndefined();
    expect(prismaMock.$transaction).toHaveBeenCalledTimes(1);
    expect(prismaMock.$transaction).toHaveBeenCalledWith(
      expect.anything(),
      expect.objectContaining({
        isolationLevel: 'RepeatableRead',
      }),
    );
    expect(prismaMock.banner.findUnique).toHaveBeenCalledTimes(1);
    expect(prismaMock.banner.update).toHaveBeenCalledTimes(1);
  });

  it('deleteBanner fail - banner not found', async () => {
    prismaMock.$transaction = jest
      .fn()
      .mockImplementation(async (func: (tx: PrismaService) => Promise<any>) => {
        return await func(prismaMock);
      });

    // banner not found
    prismaMock.banner.findUnique = jest.fn().mockResolvedValue(null);

    await expect(service.deleteBanner(1)).rejects.toThrow(
      BannerNotFoundException,
    );
  });

  it('updateBannerOrder success', async () => {
    // 1. start transaction
    prismaMock.$transaction = jest
      .fn()
      .mockImplementation(async (func: (tx: PrismaService) => Promise<any>) => {
        return await func(prismaMock);
      });

    // 2. get order of banner
    prismaMock.activeBanner.findUnique = jest.fn().mockResolvedValue({
      idx: 1,
      order: 7,
    });

    // 3. get active banner last order
    prismaMock.activeBanner.findFirst = jest.fn().mockResolvedValue({
      idx: 1,
      order: 10,
    });

    // 4. update the other banners order
    prismaMock.activeBanner.updateMany = jest.fn().mockResolvedValue({});

    // 5. update banner order
    prismaMock.activeBanner.update = jest.fn().mockResolvedValue({});

    await expect(
      service.updateBannerOrder(1, { order: 1 }),
    ).resolves.toBeUndefined();
    expect(prismaMock.$transaction).toHaveBeenCalledTimes(1);
    expect(prismaMock.$transaction).toHaveBeenCalledWith(
      expect.anything(),
      expect.objectContaining({
        isolationLevel: 'RepeatableRead',
      }),
    );
    expect(prismaMock.activeBanner.findUnique).toHaveBeenCalledTimes(1);
    expect(prismaMock.activeBanner.findFirst).toHaveBeenCalledTimes(1);
    expect(prismaMock.activeBanner.updateMany).toHaveBeenCalledTimes(1);
    expect(prismaMock.activeBanner.update).toHaveBeenCalledTimes(1);
  });

  it('updateBannerOrder fail - banner not found', async () => {
    prismaMock.$transaction = jest
      .fn()
      .mockImplementation(async (func: (tx: PrismaService) => Promise<any>) => {
        return await func(prismaMock);
      });

    // banner not found
    prismaMock.activeBanner.findUnique = jest.fn().mockResolvedValue(null);

    await expect(service.updateBannerOrder(1, { order: 4 })).rejects.toThrow(
      BannerNotFoundException,
    );
  });

  it('updateBannerOrder fail - order out of range', async () => {
    prismaMock.$transaction = jest
      .fn()
      .mockImplementation(async (func: (tx: PrismaService) => Promise<any>) => {
        return await func(prismaMock);
      });

    prismaMock.activeBanner.findUnique = jest.fn().mockResolvedValue({
      idx: 1,
      order: 1,
    });

    // the order of the last banner is 5
    prismaMock.activeBanner.findFirst = jest.fn().mockResolvedValue({
      idx: 1,
      order: 5,
    });

    // but the input order is 1000
    await expect(service.updateBannerOrder(1, { order: 1000 })).rejects.toThrow(
      BannerOrderOutOfRangeException,
    );
  });

  it('updateBannerOrder fail - try to change order to same order', async () => {
    prismaMock.$transaction = jest
      .fn()
      .mockImplementation(async (func: (tx: PrismaService) => Promise<any>) => {
        return await func(prismaMock);
      });

    // the order of the banner is 1 now
    prismaMock.activeBanner.findUnique = jest.fn().mockResolvedValue({
      idx: 1,
      order: 1,
    });

    // but the input order is same number, 1
    await expect(service.updateBannerOrder(1, { order: 1 })).rejects.toThrow(
      BadRequestException,
    );
  });

  it('updateBannerOrder fail - there is no active banner', async () => {
    prismaMock.$transaction = jest
      .fn()
      .mockImplementation(async (func: (tx: PrismaService) => Promise<any>) => {
        return await func(prismaMock);
      });

    prismaMock.activeBanner.findUnique = jest.fn().mockResolvedValue({
      idx: 1,
      order: 1,
    });

    // there is no active banner
    prismaMock.activeBanner.findFirst = jest.fn().mockResolvedValue(null);

    await expect(service.updateBannerOrder(1, { order: 3 })).rejects.toThrow(
      BannerOrderOutOfRangeException,
    );
  });

  it('activateBanner success', async () => {
    // 1. start transaction
    prismaMock.$transaction = jest
      .fn()
      .mockImplementation(async (func: (tx: PrismaService) => Promise<any>) => {
        return await func(prismaMock);
      });

    // 2. find banner with activeBanner via prisma
    const bannerIdx = 1;
    prismaMock.banner.findUnique = jest.fn().mockResolvedValue({
      idx: bannerIdx,
      ActiveBanner: null,
    });

    // 3. get the last order of the banner
    const lastOrder = 3;
    prismaMock.activeBanner.findFirst = jest.fn().mockResolvedValue({
      order: lastOrder,
    });

    // 4. create active banner
    prismaMock.activeBanner.create = jest.fn().mockResolvedValue({});

    await expect(service.activateBanner(bannerIdx)).resolves.toBeUndefined();
    expect(prismaMock.$transaction).toHaveBeenCalledTimes(1);
    expect(prismaMock.$transaction).toHaveBeenCalledWith(
      expect.anything(),
      expect.objectContaining({
        isolationLevel: 'RepeatableRead',
      }),
    );
    expect(prismaMock.banner.findUnique).toHaveBeenCalledTimes(1);
    expect(prismaMock.activeBanner.findFirst).toHaveBeenCalledTimes(1);
    expect(prismaMock.activeBanner.create).toHaveBeenCalledTimes(1);
    expect(prismaMock.activeBanner.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: {
          order: lastOrder + 1,
          idx: bannerIdx,
        },
      }),
    );
  });

  it('activateBanner success - there is no active banner', async () => {
    // 1. start  transaction
    prismaMock.$transaction = jest
      .fn()
      .mockImplementation(async (func: (tx: PrismaService) => Promise<any>) => {
        return await func(prismaMock);
      });

    // 2. find banner with activeBanner via prisma
    const bannerIdx = 1;
    prismaMock.banner.findUnique = jest.fn().mockResolvedValue({
      idx: bannerIdx,
      ActiveBanner: null,
    });

    // 3. get the last order of the banner
    prismaMock.activeBanner.findFirst = jest.fn().mockResolvedValue(null);

    // 4. create active banner
    prismaMock.activeBanner.create = jest.fn().mockResolvedValue({});

    await expect(service.activateBanner(1)).resolves.toBeUndefined();
    expect(prismaMock.$transaction).toHaveBeenCalledTimes(1);
    expect(prismaMock.$transaction).toHaveBeenCalledWith(
      expect.anything(),
      expect.objectContaining({
        isolationLevel: 'RepeatableRead',
      }),
    );
    expect(prismaMock.banner.findUnique).toHaveBeenCalledTimes(1);
    expect(prismaMock.activeBanner.findFirst).toHaveBeenCalledTimes(1);
    expect(prismaMock.activeBanner.create).toHaveBeenCalledTimes(1);
    expect(prismaMock.activeBanner.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: {
          idx: bannerIdx,
          order: 1,
        },
      }),
    );
  });

  it('activateBanner fail - banner not found', async () => {
    prismaMock.$transaction = jest
      .fn()
      .mockImplementation(async (func: (tx: PrismaService) => Promise<any>) => {
        return await func(prismaMock);
      });

    // banner not found
    prismaMock.banner.findUnique = jest.fn().mockResolvedValue(null);

    await expect(service.activateBanner(1)).rejects.toThrow(
      BannerNotFoundException,
    );
  });

  it('activateBanner fail - already active banner', async () => {
    prismaMock.$transaction = jest
      .fn()
      .mockImplementation(async (func: (tx: PrismaService) => Promise<any>) => {
        return await func(prismaMock);
      });

    // already active banner
    prismaMock.banner.findUnique = jest.fn().mockResolvedValue({
      idx: 1,
      ActiveBanner: {
        idx: 1,
      },
    });

    await expect(service.activateBanner(1)).rejects.toThrow(
      AlreadyActiveBannerException,
    );
  });

  it('deactivateBanner success', async () => {
    // 1. start transaction
    prismaMock.$transaction = jest
      .fn()
      .mockImplementation(async (func: (tx: PrismaService) => Promise<any>) => {
        return await func(prismaMock);
      });

    // 2. find banner with ActiveBanner via prisma
    prismaMock.banner.findUnique = jest.fn().mockResolvedValue({
      idx: 1,
      ActiveBanner: {
        idx: 1,
        order: 5,
      },
    });

    // 3. delete active banner
    prismaMock.activeBanner.delete = jest.fn().mockResolvedValue({});

    // 4. update the order of other banners
    prismaMock.activeBanner.updateMany = jest.fn().mockResolvedValue({});

    await expect(service.deactivateBanner(1)).resolves.toBeUndefined();
    expect(prismaMock.$transaction).toHaveBeenCalledTimes(1);
    expect(prismaMock.$transaction).toHaveBeenCalledWith(
      expect.anything(),
      expect.objectContaining({
        isolationLevel: 'RepeatableRead',
      }),
    );
    expect(prismaMock.banner.findUnique).toHaveBeenCalledTimes(1);
    expect(prismaMock.activeBanner.delete).toHaveBeenCalledTimes(1);
    expect(prismaMock.activeBanner.updateMany).toHaveBeenCalledTimes(1);
  });

  it('deactivateBanner fail - banner not found', async () => {
    prismaMock.$transaction = jest
      .fn()
      .mockImplementation(async (func: (tx: PrismaService) => Promise<any>) => {
        return await func(prismaMock);
      });

    // banner not found
    prismaMock.banner.findUnique = jest.fn().mockResolvedValue(null);

    await expect(service.deactivateBanner(1)).rejects.toThrow(
      BannerNotFoundException,
    );
  });

  it('deactivateBanner fail - already deactive banner', async () => {
    prismaMock.$transaction = jest
      .fn()
      .mockImplementation(async (func: (tx: PrismaService) => Promise<any>) => {
        return await func(prismaMock);
      });

    // already deactive banner
    prismaMock.banner.findUnique = jest.fn().mockResolvedValue({
      idx: 1,
      ActiveBanner: null,
    });

    await expect(service.deactivateBanner(1)).rejects.toThrow(
      AlreadyDeactiveBannerException,
    );
  });
});
