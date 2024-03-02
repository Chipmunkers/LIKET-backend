import { ConflictException, Injectable } from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service';
import { CreateAnswerDto } from './dto/CreateAnswerDto';
import { UpdateAnswerDto } from './dto/UpdateAnswerDto';
import { AnswerEntity } from './entity/AnswerEntity';
import { AnswerNotFoundException } from './exception/AnswerNotFoundException';
import { InquiryNotFoundException } from './exception/InquiryNotFoundException';

@Injectable()
export class AnswerService {
  constructor(private readonly prisma: PrismaService) {}

  public getAnswerByIdx: (idx: number) => Promise<AnswerEntity> = async (
    idx,
  ) => {
    const answer = await this.prisma.answer.findUnique({
      where: {
        idx,
        deletedAt: null,
        Inquiry: {
          deletedAt: null,
          User: {
            deletedAt: null,
          },
        },
      },
    });

    if (!answer) {
      throw new AnswerNotFoundException('Cannot find answer');
    }

    return AnswerEntity.createAnswer(answer);
  };

  public createAnswer: (
    inquiryIdx: number,
    createDto: CreateAnswerDto,
  ) => Promise<number> = async (inquiryIdx, createDto) => {
    const createdAnswer = await this.prisma.$transaction(
      async (tx) => {
        const inquiry = await tx.inquiry.findUnique({
          select: {
            Answer: {
              where: {
                deletedAt: null,
              },
            },
          },
          where: {
            idx: inquiryIdx,
            deletedAt: null,
            User: {
              deletedAt: null,
            },
          },
        });

        if (!inquiry) {
          throw new InquiryNotFoundException('Cannot find inquiry');
        }

        if (inquiry.Answer[0]) {
          throw new ConflictException('Already answered inquiry');
        }

        const createdAnswer = await tx.answer.create({
          data: {
            inquiryIdx,
            contents: createDto.contents,
          },
        });

        return createdAnswer;
      },
      {
        isolationLevel: 'RepeatableRead',
      },
    );

    return createdAnswer.idx;
  };

  public updateAnswer: (
    idx: number,
    updateDto: UpdateAnswerDto,
  ) => Promise<void> = async (idx, updateDto) => {
    await this.prisma.answer.update({
      where: {
        idx,
      },
      data: {
        contents: updateDto.contents,
      },
    });

    return;
  };

  public deleteAnswer: (idx: number) => Promise<void> = async (idx) => {
    await this.prisma.answer.update({
      where: {
        idx,
      },
      data: {
        deletedAt: new Date(),
      },
    });

    return;
  };
}
