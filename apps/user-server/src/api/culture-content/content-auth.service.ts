import { Injectable } from '@nestjs/common';
import { ContentPagerbleDto } from './dto/content-pagerble.dto';
import { CreateContentRequestDto } from './dto/create-content-request.dto';
import { UpdateContentDto } from './dto/update-content.dto';
import { PermissionDeniedException } from '../../common/exception/PermissionDeniedException';
import { LoginUser } from '../auth/model/login-user';
import { AcceptedContentException } from './exception/AcceptedContentException';
import { CultureContentModel } from 'libs/core/culture-content/model/culture-content.model';

@Injectable()
export class ContentAuthService {
  constructor() {}

  /**
   * @author jochongs
   */
  public checkReadAllPermission(
    pagerble: ContentPagerbleDto,
    loginUser?: LoginUser,
  ): void {
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
  public checkReadPermission(
    contentModel: CultureContentModel,
    loginUser?: LoginUser,
  ): void {
    if (
      !contentModel.acceptedAt &&
      contentModel.author.idx !== loginUser?.idx
    ) {
      throw new PermissionDeniedException();
    }
  }

  /**
   * @author jochongs
   */
  public checkWritePermission(
    loginUser: LoginUser,
    createDto: CreateContentRequestDto,
  ): void {}

  /**
   * @author jochongs
   */
  public checkUpdatePermission(
    loginUser: LoginUser,
    contentModel: CultureContentModel,
    updateDto: UpdateContentDto,
  ): void {
    if (contentModel.author.idx !== loginUser.idx) {
      throw new PermissionDeniedException();
    }

    if (contentModel.acceptedAt) {
      throw new AcceptedContentException(
        'Cannot update accepted culture content',
      );
    }
  }

  /**
   * @author jochongs
   */
  public checkDeletePermission(
    loginUser: LoginUser,
    contentModel: CultureContentModel,
  ): void {
    if (contentModel.author.idx !== loginUser.idx) {
      throw new PermissionDeniedException('Permission denied');
    }

    if (contentModel.acceptedAt) {
      throw new AcceptedContentException(
        'Cannot update accepted culture content',
      );
    }
  }
}
