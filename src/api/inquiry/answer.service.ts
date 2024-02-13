import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service';
import { CreateAnswerDto } from './dto/CreateAnswerDto';
import { UpdateAnswerDto } from './dto/UpdateAnswerDto';
import { AnswerEntity } from './entity/AnswerEntity';

@Injectable()
export class AnswerService {
  constructor(private readonly prisma: PrismaService) {}

  public getAnswerByIdx: (idx: number) => Promise<AnswerEntity>;

  public createAnswer: (
    inquiryIdx: number,
    createDto: CreateAnswerDto,
  ) => Promise<number>;

  public updateAnswer: (
    idx: number,
    updateDto: UpdateAnswerDto,
  ) => Promise<void>;

  public deleteAnswer: (idx: number) => Promise<void>;
}
