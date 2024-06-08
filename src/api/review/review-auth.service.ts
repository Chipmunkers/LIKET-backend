import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../common/module/prisma/prisma.service';
import { LoginUserDto } from '../auth/dto/login-user.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { CreateReviewDto } from './dto/create-review.dto';
import { ReviewNotFoundException } from './exception/ReviewNotFoundException';
import { PermissionDeniedException } from '../../common/exception/PermissionDeniedException';
import { ReviewPagerbleDto } from './dto/review-pagerble.dto';
import { ContentNotFoundException } from '../culture-content/exception/ContentNotFound';

@Injectable()
export class ReviewAuthService {
  constructor(private readonly prisma: PrismaService) {}

  checkReadAllPermisison: (
    loginUser: LoginUserDto,
    pagerlbe: ReviewPagerbleDto,
  ) => Promise<void> = async (loginUser, pagerble) => {
    if (pagerble.user && pagerble.user !== loginUser.idx) {
      throw new PermissionDeniedException();
    }

    if (pagerble.content) {
      const content = await this.prisma.cultureContent.findUnique({
        select: {
          idx: true,
          userIdx: true,
          acceptedAt: true,
        },
        where: {
          idx: pagerble.content,
          deletedAt: null,
          User: {
            deletedAt: null,
          },
        },
      });

      if (!content) {
        throw new ContentNotFoundException('Cannot find content');
      }

      // 수락되지 않은 컨텐츠의 리뷰는 작성자만 볼 수 있음
      if (!content.acceptedAt && content.userIdx !== loginUser.idx) {
        throw new PermissionDeniedException();
      }
    }

    return;
  };

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
