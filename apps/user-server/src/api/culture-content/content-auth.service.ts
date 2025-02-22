import { Injectable } from '@nestjs/common';
import { ContentPagerbleDto } from './dto/content-pagerble.dto';
import { CreateContentRequestDto } from './dto/create-content-request.dto';
import { UpdateContentDto } from './dto/update-content.dto';
import { ContentNotFoundException } from './exception/ContentNotFound';
import { PermissionDeniedException } from '../../common/exception/PermissionDeniedException';
import { LoginUser } from '../auth/model/login-user';
import { Logger } from '../../common/module/logger/logger.decorator';
import { LoggerService } from '../../common/module/logger/logger.service';
import { AcceptedContentException } from './exception/AcceptedContentException';
import { PrismaProvider } from 'libs/modules';

@Injectable()
export class ContentAuthService {
  constructor(
    private readonly prisma: PrismaProvider,
    @Logger(ContentAuthService.name) private readonly logger: LoggerService,
  ) {}

  /**
   * @author jochongs
   */
  public async checkReadAllPermission(
    pagerble: ContentPagerbleDto,
    loginUser?: LoginUser,
  ): Promise<void> {
    if (pagerble.user && pagerble.user !== loginUser?.idx) {
      throw new PermissionDeniedException();
    }

    if (!pagerble.accept && pagerble.user !== loginUser?.idx) {
      throw new PermissionDeniedException();
    }

    return;
  }

  /**
   * @author jochongs
   */
  public checkReadPermission: (
    contentIdx: number,
    loginUser?: LoginUser,
  ) => Promise<void> = async (contentIdx, loginUser) => {
    const content = await this.getContentByContentIdx(contentIdx);

    if (!content.acceptedAt && content.userIdx !== loginUser?.idx) {
      throw new PermissionDeniedException('Permission denied');
    }

    return;
  };

  /**
   * @author jochongs
   */
  public async checkWritePermission(
    loginUser: LoginUser,
    createDto: CreateContentRequestDto,
  ): Promise<void> {
    return;
  }

  /**
   * @author jochongs
   */
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

  /**
   * @author jochongs
   */
  public async checkDeletePermission(
    loginUser: LoginUser,
    contentIdx: number,
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

  /**
   * @author jochongs
   */
  private async getContentByContentIdx(contentIdx: number) {
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

    return content;
  }
}
