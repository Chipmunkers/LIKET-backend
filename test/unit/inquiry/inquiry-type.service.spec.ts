import { Test, TestingModule } from '@nestjs/testing';
import { InquiryTypeService } from '../../../src/api/inquiry/inquiry-type.service';
import { PrismaService } from '../../../src/prisma/prisma.service';
import { InquiryTypeEntity } from '../../../src/api/inquiry/entity/InquiryTypeEntity';
import { InquiryTypeNotFoundException } from '../../../src/api/inquiry/exception/InquiryTypeNotFoundException';

describe('InquiryTypeService', () => {
  let service: InquiryTypeService;
  let prismaMock: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        InquiryTypeService,
        {
          provide: PrismaService,
          useValue: {
            inquiryType: {},
          },
        },
      ],
    }).compile();

    service = module.get<InquiryTypeService>(InquiryTypeService);
    prismaMock = module.get<PrismaService>(PrismaService);
  });

  it('getInquiryType success', async () => {
    // 1. get inquiry type with prisma
    prismaMock.inquiryType.findUnique = jest.fn().mockResolvedValue({
      idx: 1,
    });

    await expect(service.getTypeByIdx(1)).resolves.toBeInstanceOf(
      InquiryTypeEntity,
    );
    expect(prismaMock.inquiryType.findUnique).toHaveBeenCalledTimes(1);
  });

  it('getInquiryType fail - not found', async () => {
    // not found
    prismaMock.inquiryType.findUnique = jest.fn().mockResolvedValue(null);

    await expect(service.getTypeByIdx(1)).rejects.toThrow(
      InquiryTypeNotFoundException,
    );
  });
});
