import { Injectable } from '@nestjs/common';
import { UpdateReviewDto } from './dto/update-review.dto';
import { CreateReviewDto } from './dto/create-review.dto';
import { ReviewNotFoundException } from './exception/ReviewNotFoundException';
import { PermissionDeniedException } from '../../common/exception/PermissionDeniedException';
import { ReviewPagerbleDto } from './dto/review-pagerble.dto';
import { ContentNotFoundException } from '../culture-content/exception/ContentNotFound';
import { LoginUser } from '../auth/model/login-user';
import { PrismaProvider } from 'libs/modules';

@Injectable()
export class ReviewAuthService {
  constructor(private readonly prisma: PrismaProvider) {}

  /**
   * @author jochongs
   */
  public checkReadAllPermission: (
    pagerlbe: ReviewPagerbleDto,
    loginUser?: LoginUser,
  ) => Promise<void> = async (pagerble, loginUser) => {
    if (!pagerble.user && !pagerble.content) {
      throw new PermissionDeniedException();
    }

    if (pagerble.user && pagerble.user !== loginUser?.idx) {
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
      if (!content.acceptedAt && content.userIdx !== loginUser?.idx) {
        throw new PermissionDeniedException();
      }
    }

    return;
  };

  /**
   * @author jochongs
   */
  public checkWritePermission: (
    loginUser: LoginUser,
    contentIdx: number,
    createDto: CreateReviewDto,
  ) => Promise<void> = async (loginUser, contentIdx, createDto) => {
    return;
  };

  /**
   * @author jochongs
   */
  public checkUpdatePermission: (
    loginUser: LoginUser,
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

  /**
   * @author jochongs
   */
  public checkDeletePermission: (
    loginUser: LoginUser,
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
