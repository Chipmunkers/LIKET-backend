import { Test, TestingModule } from '@nestjs/testing';
import { InquiryService } from '../../../src/api/inquiry/inquiry.service';
import { PrismaService } from '../../../src/common/prisma/prisma.service';
import { InquiryEntity } from '../../../src/api/inquiry/entity/InquiryEntity';
import { InquiryNotFoundException } from '../../../src/api/inquiry/exception/InquiryNotFoundException';

describe('InquiryService', () => {
  let service: InquiryService;
  let prismaMock: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        InquiryService,
        {
          provide: PrismaService,
          useValue: {
            inquiry: {},
          },
        },
      ],
    }).compile();

    service = module.get<InquiryService>(InquiryService);
    prismaMock = module.get<PrismaService>(PrismaService);
  });

  it('getInquiryByIdx success', async () => {
    // 1. get inquiry with prisma
    prismaMock.inquiry.findUnique = jest.fn().mockResolvedValue({
      idx: 1,
      Answer: [],
      InquiryType: {
        idx: 1,
      },
      InquiryImg: [],
    });

    await expect(service.getInquiryByIdx(1)).resolves.toBeInstanceOf(
      InquiryEntity<'detail'>,
    );
    expect(prismaMock.inquiry.findUnique).toHaveBeenCalledTimes(1);
  });

  it('getInquiryByIdx fail - not found inquiry', async () => {
    // not found
    prismaMock.inquiry.findUnique = jest.fn().mockResolvedValue(null);

    await expect(service.getInquiryByIdx(1)).rejects.toThrow(
      InquiryNotFoundException,
    );
  });
});
