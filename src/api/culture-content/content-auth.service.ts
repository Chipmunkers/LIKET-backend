import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../common/module/prisma/prisma.service';
import { ContentPagerbleDto } from './dto/content-pagerble.dto';
import { CreateContentRequestDto } from './dto/create-content-request.dto';
import { UpdateContentDto } from './dto/update-content.dto';
import { ContentNotFoundException } from './exception/ContentNotFound';
import { PermissionDeniedException } from '../../common/exception/PermissionDeniedException';
import { LoginUser } from '../auth/model/login-user';

@Injectable()
export class ContentAuthService {
  constructor(private readonly prisma: PrismaService) {}

  checkReadAllPermission: (
    loginUser: LoginUser,
    pagerble: ContentPagerbleDto,
  ) => Promise<void> = async (loginUser, pagerble) => {
    if (pagerble.user && pagerble.user !== loginUser.idx) {
      throw new PermissionDeniedException();
    }

    if (!pagerble.accept && pagerble.user !== loginUser.idx) {
      throw new PermissionDeniedException();
    }

    return;
  };

  checkReadPermission: (
    contentIdx: number,
    loginUser?: LoginUser,
  ) => Promise<void> = async (contentIdx, loginUser) => {
    const content = await this.prisma.cultureContent.findUnique({
      where: {
        idx: contentIdx,
        deletedAt: null,
        User: {
          deletedAt: null,
        },
      },
    });

    if (!content) {
      throw new ContentNotFoundException('Cannot find culture content');
    }

    if (!content.acceptedAt && content.userIdx !== loginUser?.idx) {
      throw new PermissionDeniedException('Permission denied');
    }

    return;
  };

  checkWirtePermission: (
    loginUser: LoginUser,
    createDto: CreateContentRequestDto,
  ) => Promise<void> = async (loginUser, createDto) => {
    return;
  };

  checkUpdatePermission: (
    loginUser: LoginUser,
    contentIdx: number,
    updateDto: UpdateContentDto,
  ) => Promise<void> = async (loginUser, contentIdx, updateDto) => {
    const content = await this.prisma.cultureContent.findUnique({
      where: {
        idx: contentIdx,
        deletedAt: null,
        User: {
          deletedAt: null,
        },
      },
    });

    if (!content) {
      throw new ContentNotFoundException('Cannot find culture content');
    }

    if (content.userIdx !== loginUser.idx) {
      throw new PermissionDeniedException('Permission denied');
    }

    if (content.acceptedAt) {
      throw new PermissionDeniedException(
        'Cannot update accepted culture content',
      );
    }

    return;
  };

  checkDeletePermission: (
    loginUser: LoginUser,
    contentIdx: number,
  ) => Promise<void> = async (loginUser, contentIdx) => {
    const content = await this.prisma.cultureContent.findUnique({
      where: {
        idx: contentIdx,
        deletedAt: null,
        User: {
          deletedAt: null,
        },
      },
    });

    if (!content) {
      throw new ContentNotFoundException('Cannot find culture content');
    }

    if (content.userIdx !== loginUser.idx) {
      throw new PermissionDeniedException('Permission denied');
    }

    if (content.acceptedAt) {
      throw new PermissionDeniedException(
        'Cannot update accepted culture content',
      );
    }

    return;
  };
}
