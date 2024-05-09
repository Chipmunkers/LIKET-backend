import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { LoginUserDto } from '../auth/dto/login-user.dto';
import { GetContentPagerbleDto } from './dto/get-content-all-pagerble.dto';
import { CreateContentRequestDto } from './dto/create-content-request.dto';
import { UpdateContentDto } from './dto/update-content.dto';
import { ContentNotFoundException } from './exception/ContentNotFound';
import { PermissionDeniedException } from '../../common/exception/PermissionDeniedException';

@Injectable()
export class ContentAuthService {
  constructor(private readonly prisma: PrismaService) {}

  checkReadAllPermission: (
    loginUser: LoginUserDto,
    pagerble: GetContentPagerbleDto,
  ) => Promise<void> = async (loginUser, pagerble) => {
    return;
  };

  checkReadPermission: (
    loginUser: LoginUserDto,
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

    if (!content.acceptedAt && content.userIdx !== loginUser.idx) {
      throw new PermissionDeniedException('Permission denied');
    }

    return;
  };

  checkWirtePermission: (
    loginUser: LoginUserDto,
    createDto: CreateContentRequestDto,
  ) => Promise<void> = async (loginUser, createDto) => {
    return;
  };

  checkUpdatePermission: (
    loginUser: LoginUserDto,
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
    loginUser: LoginUserDto,
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
