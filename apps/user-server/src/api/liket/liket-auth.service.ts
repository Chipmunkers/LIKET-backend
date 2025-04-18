import { Injectable } from '@nestjs/common';
import { PermissionDeniedException } from '../../common/exception/PermissionDeniedException';
import { LoginUser } from '../auth/model/login-user';
import { LiketPageableDto } from './dto/liket-pageable.dto';
import { ReviewModel } from 'libs/core/review/model/review.model';
import { LiketModel } from 'libs/core/liket/model/liket.model';

@Injectable()
export class LiketAuthService {
  constructor() {}

  /**
   * @author wherehows
   */
  public checkReadAllPermissions(
    pageable: LiketPageableDto,
    loginUser: LoginUser,
  ): void {
    if (pageable.user !== loginUser.idx) {
      throw new PermissionDeniedException();
    }

    return;
  }

  /**
   * @author wherehows
   */
  public checkCreatePermission(
    reviewModel: ReviewModel,
    loginUser: LoginUser,
  ): void {
    if (reviewModel.author.idx !== loginUser.idx) {
      throw new PermissionDeniedException();
    }
  }

  /**
   * @author wherehows
   */
  public checkUpdatePermission(
    loginUser: LoginUser,
    liketModel: LiketModel,
  ): void {
    if (liketModel.author.idx !== loginUser.idx) {
      throw new PermissionDeniedException('Permission denied');
    }

    return;
  }

  /**
   * @author wherehows
   */
  public checkDeletePermission(loginUser: LoginUser, liket: LiketModel): void {
    if (liket.author.idx !== loginUser.idx) {
      throw new PermissionDeniedException('Permission denied');
    }

    return;
  }
}
