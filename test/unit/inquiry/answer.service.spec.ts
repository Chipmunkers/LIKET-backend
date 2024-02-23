import { Test, TestingModule } from '@nestjs/testing';
import { AnswerService } from '../../../src/api/inquiry/answer.service';
import { PrismaService } from '../../../src/common/prisma/prisma.service';
import { AnswerEntity } from '../../../src/api/inquiry/entity/AnswerEntity';
import { AnswerNotFoundException } from '../../../src/api/inquiry/exception/AnswerNotFoundException';
import { CreateAnswerDto } from '../../../src/api/inquiry/dto/CreateAnswerDto';
import { ConflictException } from '@nestjs/common';

describe('AnswerService', () => {
  let service: AnswerService;
  let prismaMock: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AnswerService,
        {
          provide: PrismaService,
          useValue: {},
        },
      ],
    }).compile();

    service = module.get<AnswerService>(AnswerService);
    prismaMock = module.get<PrismaService>(PrismaService);
  });

  it('getAnswerByIdx success', async () => {
    // 1. get answer with prisma
    prismaMock.answer.findFirst = jest.fn().mockResolvedValue({
      idx: 1,
    });

    await expect(service.getAnswerByIdx(1)).resolves.toBeInstanceOf(
      AnswerEntity,
    );
    expect(prismaMock.answer.findFirst).toHaveBeenCalledTimes(1);
  });

  it('getAnswerByIdx fail - not found', async () => {
    // not found
    prismaMock.answer.findFirst = jest.fn().mockResolvedValue(null);

    await expect(service.getAnswerByIdx(1)).rejects.toThrow(
      AnswerNotFoundException,
    );
  });

  it('createAnswer success', async () => {
    // 1. get answer with inquiry idx
    prismaMock.answer.findFirst = jest.fn().mockResolvedValue(null);

    // 2. create answer
    prismaMock.answer.create = jest.fn().mockResolvedValue({
      idx: 1,
    });

    await expect(service.createAnswer(1, {} as CreateAnswerDto)).resolves.toBe(
      1,
    );
    expect(prismaMock.answer.findFirst).toHaveBeenCalledTimes(1);
    expect(prismaMock.answer.create).toHaveBeenCalledTimes(1);
  });

  it('createAnswer fail - inquiry already has answer', async () => {
    // inquiry already has answer
    prismaMock.answer.findFirst = jest.fn().mockResolvedValue({
      idx: 1,
    });

    await expect(
      service.createAnswer(1, {} as CreateAnswerDto),
    ).rejects.toThrow(ConflictException);
  });
});
