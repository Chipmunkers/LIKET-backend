import { Injectable } from '@nestjs/common';
import { PermissionDeniedException } from '../../common/exception/PermissionDeniedException';
import { LoginUser } from '../auth/model/login-user';
import { LiketPageableDto } from './dto/liket-pageable.dto';
import { LiketNotFoundException } from './exception/LiketNotFoundException';
import { LiketRepository } from './liket.repository';
import { ReviewRepository } from '../review/review.repository';
import { ReviewNotFoundException } from '../review/exception/ReviewNotFoundException';
import { AlreadyExistLiketException } from './exception/AlreadyExistLiketException';

@Injectable()
export class LiketAuthService {
  constructor(
    private readonly liketRepository: LiketRepository,
    private readonly reviewRepository: ReviewRepository,
  ) {}

  async checkCreatePermission(reviewIdx: number, userIdx: number) {
    const review = await this.reviewRepository.selectReviewByIdx(reviewIdx);

    const liket = await this.liketRepository.selectLiketByReviewIdx(reviewIdx);

    if (liket) {
      throw new AlreadyExistLiketException('Already exist LIKET');
    }

    if (!review) {
      throw new ReviewNotFoundException('Cannot find review');
    }

    if (review.userIdx !== userIdx) {
      throw new PermissionDeniedException('Permission denied');
    }

    return;
  }

  async checkDeletePermission(loginUser: LoginUser, liketIdx: number) {
    const liket = await this.liketRepository.selectLiketByIdx(liketIdx);

    if (!liket) {
      throw new LiketNotFoundException('Cannot find liket');
    }

    if (liket.Review.userIdx !== loginUser.idx) {
      throw new PermissionDeniedException('Permission denied');
    }

    return;
  }

  checkReadAllPermissions(pageable: LiketPageableDto, loginUser: LoginUser) {
    if (pageable.user !== loginUser.idx) {
      throw new PermissionDeniedException();
    }

    return;
  }

  async checkUpdatePermission(loginUser: LoginUser, liketIdx: number) {
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
