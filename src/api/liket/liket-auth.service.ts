import { PermissionDeniedException } from '../../common/exception/PermissionDeniedException';
import { PrismaService } from '../../common/module/prisma/prisma.service';
import { LoginUserDto } from '../auth/dto/login-user.dto';
import { ReviewNotFoundException } from '../review/exception/ReviewNotFoundException';
import { CreateLiketDto } from './dto/create-liket.dto';
import { LiketPagerbleDto } from './dto/liket-pagerble.dto';
import { UpdateLiketDto } from './dto/update-liket.dto';
import { LiketNotFoundException } from './exception/LiketNotFoundException';

export class LiketAuthService {
  constructor(private readonly prisma: PrismaService) {}

  checkReadAllPermission: (
    loginUser: LoginUserDto,
    pagerble: LiketPagerbleDto,
  ) => Promise<void> = async (loginUser, pagerble) => {
    if (!pagerble.user) {
      throw new PermissionDeniedException();
    }

    if (pagerble.user !== loginUser.idx) {
      throw new PermissionDeniedException();
    }

    return;
  };

  checkReadPermission: (loginUser: LoginUserDto, idx: number) => Promise<void> =
    async (loginUser, idx) => {
      return;
    };

  checkWritePermission: (
    loginUser: LoginUserDto,
    reviewIdx: number,
    createDto: CreateLiketDto,
  ) => Promise<void> = async (loginUser, reviewIdx, createDto) => {
    const review = await this.prisma.review.findUnique({
      select: {
        userIdx: true,
      },
      where: {
        idx: reviewIdx,
        deletedAt: null,
      },
    });

    if (!review) {
      throw new ReviewNotFoundException('Cannot find review');
    }

    if (review.userIdx !== loginUser.idx) {
      throw new PermissionDeniedException();
    }

    return;
  };

  checkUpdatePermission: (
    loginUser: LoginUserDto,
    idx: number,
    updateDto: UpdateLiketDto,
  ) => Promise<void> = async (loginUser, idx) => {
    const liket = await this.prisma.liket.findUnique({
      where: {
        idx,
        deletedAt: null,
      },
    });

    if (!liket) {
      throw new LiketNotFoundException('Cannot find LIKET');
    }

    if (liket.userIdx !== loginUser.idx) {
      throw new PermissionDeniedException();
    }

    return;
  };

  checkDeletePermission: (
    loginUser: LoginUserDto,
    idx: number,
  ) => Promise<void> = async (loginUser, idx) => {
    const liket = await this.prisma.liket.findUnique({
      where: {
        idx,
        deletedAt: null,
      },
    });

    if (!liket) {
      throw new LiketNotFoundException('Cannot find LIKET');
    }

    if (liket.userIdx !== loginUser.idx) {
      throw new PermissionDeniedException();
    }

    return;
  };
}
