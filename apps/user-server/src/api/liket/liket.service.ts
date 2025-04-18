import { Injectable } from '@nestjs/common';
import { UpdateLiketDto } from './dto/update-liket.dto';
import { LiketEntity } from './entity/liket.entity';
import { Prisma } from '@prisma/client';
import { Logger } from '../../common/module/logger/logger.decorator';
import { LoggerService } from '../../common/module/logger/logger.service';
import { LiketNotFoundException } from './exception/LiketNotFoundException';
import { LiketPageableDto } from './dto/liket-pageable.dto';
import { CreateLiketDto } from './dto/create-liket.dto';
import { LiketRepository } from './liket.repository';
import { SummaryLiketEntity } from './entity/summary-liket.entity';
import { TextShapeEntity } from './entity/text-shape.entity';
import { ImgShapeEntity } from './entity/img-shape.entity';
import { BgImgInfoEntity } from './entity/bg-img-info.entity';
import { LiketCoreService } from 'libs/core/liket/liket-core.service';

@Injectable()
export class LiketService {
  constructor(
    private readonly liketCoreService: LiketCoreService,
    private readonly liketRepository: LiketRepository,
    @Logger(LiketService.name) private readonly logger: LoggerService,
  ) {}

  /**
   * 라이켓 리스트 조회
   *
   * @author wherehows
   */
  public async getLiketAll(
    pageable: LiketPageableDto,
  ): Promise<SummaryLiketEntity[]> {
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
  public async createLiket(reviewIdx: number, createDto: CreateLiketDto) {
    const liket = await this.liketRepository.insertLiket(reviewIdx, createDto);

    const { textShape, bgImgInfo, LiketImgShape } = liket;

    if (!this.isValidTextShapeEntity(textShape)) {
      this.logger.warn(this.getLiketByIdx, 'invalid liket text shape');
    }

    if (!this.isValidBgImgInfoEntity(bgImgInfo)) {
      this.logger.warn(
        this.getLiketByIdx,
        'invalid liket background img information',
      );
    }

    const imgShapes = LiketImgShape.map(({ imgShape }) => {
      return imgShape;
    });

    if (!this.isValidImgShapeEntity(imgShapes)) {
      this.logger.warn(this.getLiketByIdx, 'invalid liket img shape');
    }

    return LiketEntity.createEntity(
      liket,
      bgImgInfo as any,
      imgShapes as any,
      textShape as any,
    );
  }

  /**
   * 업데이트 라이켓
   *
   * @author wherehows
   */
  public async updateLiket(idx: number, updateDto: UpdateLiketDto) {
    return await this.liketRepository.updateLiketByIdx(idx, updateDto);
  }

  /**
   * 라이켓 삭제
   *
   * @author wherehows
   */
  public async deleteLiket(liketIdx: number) {
    return this.liketRepository.deleteLiketByIdx(liketIdx);
  }

  private isValidTextShapeEntity(obj: unknown): obj is TextShapeEntity | null {
    if (TextShapeEntity.isSameStructure(obj) || obj === null) {
      return true;
    }

    return false;
  }

  private isValidBgImgInfoEntity(obj: unknown): obj is BgImgInfoEntity {
    return BgImgInfoEntity.isSameStructure(obj);
  }

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
