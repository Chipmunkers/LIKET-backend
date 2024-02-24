import { Test, TestingModule } from '@nestjs/testing';
import { BannerService } from '../../../src/api/banner/banner.service';
import { PrismaService } from '../../../src/common/prisma/prisma.service';
import { BannerEntity } from '../../../src/api/banner/entity/BannerEntity';

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
});
