import { Injectable } from '@nestjs/common';
import { UpdateReviewDto } from './dto/update-review.dto';
import { CreateReviewDto } from './dto/create-review.dto';
import { ReviewNotFoundException } from './exception/ReviewNotFoundException';
import { PermissionDeniedException } from '../../common/exception/PermissionDeniedException';
import { ReviewPageableDto } from './dto/review-pageable.dto';
import { ContentNotFoundException } from '../culture-content/exception/ContentNotFound';
import { LoginUser } from '../auth/model/login-user';
import { PrismaProvider } from 'libs/modules';

@Injectable()
export class ReviewAuthService {
  constructor(private readonly prisma: PrismaProvider) {}

  /**
   * 목록보기 권한 확인 메서드
   *
   * @author jochongs
   */
  public async checkReadAllPermission(
    pageable: ReviewPageableDto,
    loginUser?: LoginUser,
  ): Promise<void> {
    if (!pageable.user && !pageable.content) {
      throw new PermissionDeniedException();
    }

    if (pageable.user && pageable.user !== loginUser?.idx) {
      throw new PermissionDeniedException();
    }

    if (pageable.content) {
      const content = await this.prisma.cultureContent.findUnique({
        select: {
          idx: true,
          userIdx: true,
          acceptedAt: true,
        },
        where: {
          idx: pageable.content,
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
  }

  /**
   * @author jochongs
   */
  public async checkWritePermission(
    loginUser: LoginUser,
    contentIdx: number,
    createDto: CreateReviewDto,
  ): Promise<void> {
    return;
  }

  /**
   * @author jochongs
   */
  public async checkUpdatePermission(
    loginUser: LoginUser,
    reviewIdx: number,
    updateDto: UpdateReviewDto,
  ): Promise<void> {
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
  }

  /**
   * @author jochongs
   */
  public async checkDeletePermission(
    loginUser: LoginUser,
    reviewIdx: number,
  ): Promise<void> {
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
  }
}
