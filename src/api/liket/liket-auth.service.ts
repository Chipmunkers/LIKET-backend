import { PermissionDeniedException } from '../../common/exception/PermissionDeniedException';
import { PrismaService } from '../../common/module/prisma/prisma.service';
import { LoginUser } from '../auth/model/login-user';
import { ReviewNotFoundException } from '../review/exception/ReviewNotFoundException';
import { CreateLiketDto } from './dto/create-liket.dto';
import { LiketPagerbleDto } from './dto/liket-pagerble.dto';
import { UpdateLiketDto } from './dto/update-liket.dto';
import { LiketNotFoundException } from './exception/LiketNotFoundException';
import { Logger } from '../../common/module/logger/logger.decorator';
import { LoggerService } from '../../common/module/logger/logger.service';

export class LiketAuthService {
  constructor(
    private readonly prisma: PrismaService,
    @Logger(LiketAuthService.name) private readonly logger: LoggerService,
  ) {}

  /**
   * 라이켓 읽기 권한 확인하기
   */
  public async checkReadAllPermission(
    loginUser: LoginUser,
    pagerble: LiketPagerbleDto,
  ): Promise<void> {
    if (!pagerble.user) {
      this.logger.warn(
        this.checkReadAllPermission,
        'Attempt to read likets without user pagerble',
      );
      throw new PermissionDeniedException();
    }

    if (pagerble.user !== loginUser.idx) {
      this.logger.warn(
        this.checkReadAllPermission,
        'Unauthenticated user attempt to read likets',
      );
      throw new PermissionDeniedException();
    }

    return;
  }

  /**
   * 라이켓 읽기 권한 확인하기
   */
  public async checkReadPermission(
    loginUser: LoginUser,
    idx: number,
  ): Promise<void> {
    return;
  }

  /**
   * 라이켓 쓰기 권한 확인하기
   */
  public async checkWritePermission(
    loginUser: LoginUser,
    reviewIdx: number,
    createDto: CreateLiketDto,
  ): Promise<void> {
    this.logger.log(this.checkWritePermission, 'SELECT review');
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
      this.logger.warn(
        this.checkWritePermission,
        'Attempt to create liket with non-existent review',
      );
      throw new ReviewNotFoundException('Cannot find review');
    }

    if (review.userIdx !== loginUser.idx) {
      this.logger.warn(
        this.checkWritePermission,
        `Unauthenticated user attempted to create liket with review ${reviewIdx}`,
      );
      throw new PermissionDeniedException();
    }

    return;
  }

  /**
   * 수정 권한 확인하기
   */
  public async checkUpdatePermission(
    loginUser: LoginUser,
    idx: number,
    updateDto: UpdateLiketDto,
  ): Promise<void> {
    const liket = await this.getLiketByIdx(idx);

    if (liket.userIdx !== loginUser.idx) {
      this.logger.warn(
        this.checkUpdatePermission,
        `Unauthenticated user ${loginUser.idx} attempted to update liket ${idx}`,
      );
      throw new PermissionDeniedException();
    }

    return;
  }

  public async checkDeletePermission(
    loginUser: LoginUser,
    idx: number,
  ): Promise<void> {
    const liket = await this.getLiketByIdx(idx);

    if (liket.userIdx !== loginUser.idx) {
      this.logger.warn(
        this.checkUpdatePermission,
        `Unauthenticated user ${loginUser.idx} attempted to delete liket ${idx}`,
      );
      throw new PermissionDeniedException();
    }

    return;
  }

  private async getLiketByIdx(idx: number) {
    this.logger.log(this.checkUpdatePermission, `SELECT liket ${idx}`);
    const liket = await this.prisma.liket.findUnique({
      where: {
        idx,
        deletedAt: null,
      },
    });

    if (!liket) {
      this.logger.warn(
        this.checkUpdatePermission,
        `Attempt to update non-existent liket ${idx}`,
      );
      throw new LiketNotFoundException('Cannot find LIKET');
    }
    return liket;
  }
}
