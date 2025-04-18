import { Injectable } from '@nestjs/common';
import { UpdateLiketDto } from './dto/update-liket.dto';
import { LiketEntity } from './entity/liket.entity';
import { LiketNotFoundException } from './exception/LiketNotFoundException';
import { LiketPageableDto } from './dto/liket-pageable.dto';
import { CreateLiketDto } from './dto/create-liket.dto';
import { SummaryLiketEntity } from './entity/summary-liket.entity';
import { TextShapeEntity } from './entity/text-shape.entity';
import { ImgShapeEntity } from './entity/img-shape.entity';
import { BgImgInfoEntity } from './entity/bg-img-info.entity';
import { LiketCoreService } from 'libs/core/liket/liket-core.service';
import { LoginUser } from 'apps/user-server/src/api/auth/model/login-user';
import { ReviewCoreService } from 'libs/core/review/review-core.service';
import { LiketAuthService } from 'apps/user-server/src/api/liket/liket-auth.service';
import { ReviewNotFoundException } from 'apps/user-server/src/api/review/exception/ReviewNotFoundException';

@Injectable()
export class LiketService {
  constructor(
    private readonly liketCoreService: LiketCoreService,
    private readonly reviewCoreService: ReviewCoreService,
    private readonly liketAuthService: LiketAuthService,
  ) {}

  /**
   * 라이켓 리스트 조회
   *
   * @author wherehows
   */
  public async getLiketAll(
    pageable: LiketPageableDto,
    loginUser: LoginUser,
  ): Promise<SummaryLiketEntity[]> {
    this.liketAuthService.checkReadAllPermissions(pageable, loginUser);

    const liketList = await this.liketCoreService.findLiketAll({
      page: pageable.page,
      row: 10,
      order: pageable.order,
      orderBy: pageable.orderby === 'time' ? 'idx' : 'idx',
      userIdx: pageable.user,
    });

    return liketList.map(SummaryLiketEntity.fromModel);
  }

  /**
   * 라이켓 자세히보기
   *
   * @author wherehows
   */
  public async getLiketByIdx(idx: number) {
    const liket = await this.liketCoreService.findLiketByIdx(idx);

    if (!liket) {
      throw new LiketNotFoundException('Cannot find liket');
    }

    // TODO: Check the below comments is necessary
    // const { textShape, bgImgInfo, LiketImgShape } = liket;

    // if (!this.isValidTextShapeEntity(textShape)) {
    //   this.logger.warn(this.getLiketByIdx, 'invalid liket text shape');
    // }

    // if (!this.isValidBgImgInfoEntity(bgImgInfo)) {
    //   this.logger.warn(
    //     this.getLiketByIdx,
    //     'invalid liket background img information',
    //   );
    // }

    // const imgShapes = LiketImgShape.map(({ imgShape }) => {
    //   return imgShape;
    // });

    // if (!this.isValidImgShapeEntity(imgShapes)) {
    //   this.logger.warn(this.getLiketByIdx, 'invalid liket img shape');
    // }

    return LiketEntity.fromModel(liket);
  }

  /**
   * 라이켓 생성
   *
   * @author wherehows
   */
  public async createLiket(
    reviewIdx: number,
    createDto: CreateLiketDto,
    loginUser: LoginUser,
  ) {
    const reviewModel = await this.reviewCoreService.findReviewByIdx(
      reviewIdx,
      loginUser.idx,
    );

    if (!reviewModel) {
      throw new ReviewNotFoundException('review does not exist');
    }

    this.liketAuthService.checkCreatePermission(reviewModel, loginUser);

    const liket = await this.liketCoreService.createLiket(reviewIdx, createDto);

    // const { textShape, bgImgInfo, LiketImgShape } = liket;

    // if (!this.isValidTextShapeEntity(textShape)) {
    //   this.logger.warn(this.getLiketByIdx, 'invalid liket text shape');
    // }

    // if (!this.isValidBgImgInfoEntity(bgImgInfo)) {
    //   this.logger.warn(
    //     this.getLiketByIdx,
    //     'invalid liket background img information',
    //   );
    // }

    // const imgShapes = LiketImgShape.map(({ imgShape }) => {
    //   return imgShape;
    // });

    // if (!this.isValidImgShapeEntity(imgShapes)) {
    //   this.logger.warn(this.getLiketByIdx, 'invalid liket img shape');
    // }

    return LiketEntity.fromModel(liket);
  }

  /**
   * 업데이트 라이켓
   *
   * @author wherehows
   */
  public async updateLiket(
    idx: number,
    updateDto: UpdateLiketDto,
    loginUser: LoginUser,
  ): Promise<void> {
    const liket = await this.liketCoreService.findLiketByIdx(idx);

    if (!liket) {
      throw new LiketNotFoundException('cannot find liket');
    }

    this.liketAuthService.checkUpdatePermission(loginUser, liket);

    return await this.liketCoreService.updateLiketByIdx(idx, updateDto);
  }

  /**
   * 라이켓 삭제
   *
   * @author wherehows
   */
  public async deleteLiket(liketIdx: number, loginUser: LoginUser) {
    const liketModel = await this.liketCoreService.findLiketByIdx(liketIdx);

    if (!liketModel) {
      throw new LiketNotFoundException('Cannot find liket');
    }

    this.liketAuthService.checkDeletePermission(loginUser, liketModel);

    return await this.liketCoreService.deleteLiketByIdx(liketIdx);
  }

  /**
   * 검증 로직 위치를 다시 고려할 필요가 있어 deprecated 되었습니다.
   * 특별히 좋은 계획이 있기 전까지 아래 메서드는 사용하지 마십시오.
   *
   * @deprecated
   */
  private isValidTextShapeEntity(obj: unknown): obj is TextShapeEntity | null {
    if (TextShapeEntity.isSameStructure(obj) || obj === null) {
      return true;
    }

    return false;
  }

  /**
   * 검증 로직 위치를 다시 고려할 필요가 있어 deprecated 되었습니다.
   * 특별히 좋은 계획이 있기 전까지 아래 메서드는 사용하지 마십시오.
   *
   * @deprecated
   */
  private isValidBgImgInfoEntity(obj: unknown): obj is BgImgInfoEntity {
    return BgImgInfoEntity.isSameStructure(obj);
  }

  /**
   * 검증 로직 위치를 다시 고려할 필요가 있어 deprecated 되었습니다.
   * 특별히 좋은 계획이 있기 전까지 아래 메서드는 사용하지 마십시오.
   *
   * @deprecated
   */
  private isValidImgShapeEntity(obj: unknown): obj is ImgShapeEntity[] {
    if (!Array.isArray(obj)) {
      return false;
    }

    for (let i = 0; i < obj.length; i++) {
      if (!ImgShapeEntity.isSameStructure(obj[i])) {
        return false;
      }
    }

    return true;
  }
}
