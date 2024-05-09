import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { LoginUserDto } from '../auth/dto/login-user.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { CreateReviewDto } from './dto/create-review.dto';
import { ReviewNotFoundException } from './exception/ReviewNotFoundException';
import { PermissionDeniedException } from '../../common/exception/PermissionDeniedException';

@Injectable()
export class ReviewAuthService {
  constructor(private readonly prisma: PrismaService) {}

  checkWritePermission: (
    loginUser: LoginUserDto,
    contentIdx: number,
    createDto: CreateReviewDto,
  ) => Promise<void> = async (loginUser, contentIdx, createDto) => {
    return;
  };

  checkUpdatePermission: (
    loginUser: LoginUserDto,
    reviewIdx: number,
    updateDto: UpdateReviewDto,
  ) => Promise<void> = async (loginUser, reviewIdx, updateDto) => {
    const review = await this.prisma.review.findUnique({
      where: {
        idx: reviewIdx,
        deletedAt: null,
        User: {
          deletedAt: null,
        },
        CultureContent: {
          deletedAt: null,
        },
      },
    });

    if (!review) {
      throw new ReviewNotFoundException('Cannot find review');
    }

    if (review.userIdx !== loginUser.idx) {
      throw new PermissionDeniedException('Permission denied');
    }

    return;
  };

  checkDeletePermission: (
    loginUser: LoginUserDto,
    reviewIdx: number,
  ) => Promise<void> = async (loginUser, reviewIdx) => {
    const review = await this.prisma.review.findUnique({
      where: {
        idx: reviewIdx,
        deletedAt: null,
        User: {
          deletedAt: null,
        },
        CultureContent: {
          deletedAt: null,
        },
      },
    });

    if (!review) {
      throw new ReviewNotFoundException('Cannot find review');
    }

    if (review.userIdx !== loginUser.idx) {
      throw new PermissionDeniedException('Permission denied');
    }

    return;
  };
}
