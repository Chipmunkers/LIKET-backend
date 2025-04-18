import { Injectable } from '@nestjs/common';
import { PermissionDeniedException } from '../../common/exception/PermissionDeniedException';
import { LoginUser } from '../auth/model/login-user';
import { LiketPageableDto } from './dto/liket-pageable.dto';
import { LiketNotFoundException } from './exception/LiketNotFoundException';
import { LiketRepository } from './liket.repository';
import { ReviewRepository } from '../review/review.repository';
import { ReviewNotFoundException } from '../review/exception/ReviewNotFoundException';
import { AlreadyExistLiketException } from './exception/AlreadyExistLiketException';
import { ReviewModel } from 'libs/core/review/model/review.model';

@Injectable()
export class LiketAuthService {
  constructor(
    private readonly liketRepository: LiketRepository,
    private readonly reviewRepository: ReviewRepository,
  ) {}

  /**
   * @author wherehows
   */
  public checkReadAllPermissions(
    pageable: LiketPageableDto,
    loginUser: LoginUser,
  ) {
    if (pageable.user !== loginUser.idx) {
      throw new PermissionDeniedException();
    }

    return;
  }

  /**
   * @author wherehows
   */
  public checkCreatePermission(reviewModel: ReviewModel, loginUser: LoginUser) {
    if (reviewModel.author.idx !== loginUser.idx) {
      throw new PermissionDeniedException();
    }
  }

  /**
   * @author wherehows
   */
  public async checkDeletePermission(loginUser: LoginUser, liketIdx: number) {
    const liket = await this.liketRepository.selectLiketByIdx(liketIdx);

    if (!liket) {
      throw new LiketNotFoundException('Cannot find liket');
    }

    if (liket.Review.userIdx !== loginUser.idx) {
      throw new PermissionDeniedException('Permission denied');
    }

    return;
  }

  /**
   * @author wherehows
   */
  public async checkUpdatePermission(loginUser: LoginUser, liketIdx: number) {
    const liket = await this.liketRepository.selectLiketByIdx(liketIdx);

    if (!liket) {
      throw new LiketNotFoundException('Cannot find liket');
    }

    if (liket.Review.userIdx !== loginUser.idx) {
      throw new PermissionDeniedException('Permission denied');
    }

    return;
  }
}
