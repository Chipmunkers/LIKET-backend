import { Test, TestingModule } from '@nestjs/testing';
import { AnswerService } from '../../../src/api/inquiry/answer.service';
import { PrismaService } from '../../../src/common/prisma/prisma.service';
import { AnswerEntity } from '../../../src/api/inquiry/entity/AnswerEntity';
import { AnswerNotFoundException } from '../../../src/api/inquiry/exception/AnswerNotFoundException';
import { CreateAnswerDto } from '../../../src/api/inquiry/dto/CreateAnswerDto';
import { ConflictException } from '@nestjs/common';
import { InquiryNotFoundException } from '../../../src/api/inquiry/exception/InquiryNotFoundException';

describe('AnswerService', () => {
  let service: AnswerService;
  let prismaMock: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AnswerService,
        {
          provide: PrismaService,
          useValue: {
            inquiry: {},
            answer: {},
          },
        },
      ],
    }).compile();

    service = module.get<AnswerService>(AnswerService);
    prismaMock = module.get<PrismaService>(PrismaService);
  });

  it('getAnswerByIdx success', async () => {
    // 1. get answer with prisma
    prismaMock.answer.findUnique = jest.fn().mockResolvedValue({
      idx: 1,
    });

    await expect(service.getAnswerByIdx(1)).resolves.toBeInstanceOf(
      AnswerEntity,
    );
    expect(prismaMock.answer.findUnique).toHaveBeenCalledTimes(1);
  });

  it('getAnswerByIdx fail - not found', async () => {
    // not found
    prismaMock.answer.findUnique = jest.fn().mockResolvedValue(null);

    await expect(service.getAnswerByIdx(1)).rejects.toThrow(
      AnswerNotFoundException,
    );
  });

  it('createAnswer success', async () => {
    // 1. start transaction
    prismaMock.$transaction = jest
      .fn()
      .mockImplementation(
        async (func = (tx: PrismaService) => Promise<any>) => {
          return await func(prismaMock);
        },
      );

    // 2. find unqiue inquiry in transaction
    prismaMock.inquiry.findUnique = jest.fn().mockResolvedValue({
      idx: 1,
      Answer: [],
    });

    // 3. create answer
    prismaMock.answer.create = jest.fn().mockResolvedValue({
      idx: 1,
    });

    await expect(service.createAnswer(1, {} as CreateAnswerDto)).resolves.toBe(
      1,
    );
    expect(prismaMock.$transaction).toHaveBeenCalledTimes(1);
    expect(prismaMock.inquiry.findUnique).toHaveBeenCalledTimes(1);
    expect(prismaMock.answer.create).toHaveBeenCalledTimes(1);
  });

  it('createAnswer fail - inquiry already has answer', async () => {
    prismaMock.$transaction = jest
      .fn()
      .mockImplementation(
        async (func = (tx: PrismaService) => Promise<any>) => {
          return await func(prismaMock);
        },
      );

    // inquiry has already answer
    prismaMock.inquiry.findUnique = jest.fn().mockResolvedValue({
      idx: 1,
      Answer: [
        {
          idx: 2,
          contents: '',
          inquiryIdx: 1,
        },
      ],
    });

    await expect(
      service.createAnswer(1, {} as CreateAnswerDto),
    ).rejects.toThrow(ConflictException);
  });

  it('createAnswer fail - cannot find inquiry', async () => {
    prismaMock.$transaction = jest
      .fn()
      .mockImplementation(
        async (func = (tx: PrismaService) => Promise<any>) => {
          return await func(prismaMock);
        },
      );

    // inquiry has already answer
    prismaMock.inquiry.findUnique = jest.fn().mockResolvedValue(null);

    await expect(
      service.createAnswer(1, {} as CreateAnswerDto),
    ).rejects.toThrow(InquiryNotFoundException);
  });
});
