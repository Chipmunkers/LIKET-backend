import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../common/module/prisma/prisma.service';
import { ContentPagerbleDto } from './dto/content-pagerble.dto';
import { CreateContentRequestDto } from './dto/create-content-request.dto';
import { UpdateContentDto } from './dto/update-content.dto';
import { ContentNotFoundException } from './exception/ContentNotFound';
import { PermissionDeniedException } from '../../common/exception/PermissionDeniedException';
import { LoginUser } from '../auth/model/login-user';
import { Logger } from '../../common/module/logger/logger.decorator';
import { LoggerService } from '../../common/module/logger/logger.service';
import { AcceptedContentException } from './exception/AcceptedContentException';

@Injectable()
export class ContentAuthService {
  constructor(
    private readonly prisma: PrismaService,
    @Logger(ContentAuthService.name) private readonly logger: LoggerService,
  ) {}

  public async checkReadAllPermission(
    pagerble: ContentPagerbleDto,
    loginUser?: LoginUser,
  ): Promise<void> {
    this.logger.log(
      this.checkReadAllPermission,
      'Check content read permission',
    );
    if (pagerble.user && pagerble.user !== loginUser?.idx) {
      this.logger.warn(
        this.checkReadAllPermission,
        `Unauthenticated attempt to read content with user pagerble | user = ${
          loginUser?.idx || 'Guest'
        }`,
      );
      throw new PermissionDeniedException();
    }

    if (!pagerble.accept && pagerble.user !== loginUser?.idx) {
      this.logger.warn(
        this.checkReadAllPermission,
        `Unauthenticated attempt to read content with accept pagerble | user = ${
          loginUser?.idx || 'Guest'
        }`,
      );
      throw new PermissionDeniedException();
    }

    return;
  }

  checkReadPermission: (
    contentIdx: number,
    loginUser?: LoginUser,
  ) => Promise<void> = async (contentIdx, loginUser) => {
    this.logger.log(
      this.checkReadPermission,
      `SELECT culture content | content = ${contentIdx}`,
    );
    const content = await this.getContentByContentIdx(contentIdx);

    if (!content.acceptedAt && content.userIdx !== loginUser?.idx) {
      this.logger.warn(
        this.checkReadPermission,
        'Unauthenticated attempt to read not accepted content',
      );
      throw new PermissionDeniedException('Permission denied');
    }

    return;
  };

  public async checkWritePermission(
    loginUser: LoginUser,
    createDto: CreateContentRequestDto,
  ): Promise<void> {
    return;
  }

  public async checkUpdatePermission(
    loginUser: LoginUser,
    contentIdx: number,
    updateDto: UpdateContentDto,
  ): Promise<void> {
    const content = await this.getContentByContentIdx(contentIdx);

    if (content.userIdx !== loginUser.idx) {
      throw new PermissionDeniedException('Permission denied');
    }

    if (content.acceptedAt) {
      throw new AcceptedContentException(
        'Cannot update accepted culture content',
      );
    }

    return;
  }

  public async checkDeletePermission(
    loginUser: LoginUser,
    contentIdx: number,
  ): Promise<void> {
    const content = await this.getContentByContentIdx(contentIdx);

    if (content.userIdx !== loginUser.idx) {
      this.logger.warn(
        this.checkDeletePermission,
        `Attempt to delete unauthenticated user | user = ${loginUser.idx}`,
      );
      throw new PermissionDeniedException('Permission denied');
    }

    if (content.acceptedAt) {
      this.logger.warn(
        this.checkDeletePermission,
        'Attempt to delete accepted content',
      );
      throw new AcceptedContentException(
        'Cannot update accepted culture content',
      );
    }

    return;
  }

  private async getContentByContentIdx(contentIdx: number) {
    this.logger.log(
      this.getContentByContentIdx,
      `SELECT content = ${contentIdx}`,
    );
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
      this.logger.warn(
        this.checkReadPermission,
        `Attempt to non-existent content | content = ${contentIdx}`,
      );
      throw new ContentNotFoundException('Cannot find culture content');
    }

    return content;
  }
}
