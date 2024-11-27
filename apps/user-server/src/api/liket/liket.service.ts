import { Injectable, InternalServerErrorException } from '@nestjs/common';
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
import { TextShapeEntity } from './entity/textShape.entity';
import { ImgShapeEntity } from './entity/imgShape.entity';
import { BgImgInfoEntity } from './entity/bgImgInfo.entity';

@Injectable()
export class LiketService {
  constructor(
    private readonly liketRepository: LiketRepository,
    @Logger(LiketService.name) private readonly logger: LoggerService,
  ) {}

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
   * 라이켓 리스트 조회
   *
   * @author wherehows
   */
  public async getLiketAll(pageable: LiketPageableDto) {
    const liketList = await this.liketRepository.selectLiketAll(pageable);

    return {
      liketList: liketList.map((liket) =>
        SummaryLiketEntity.createEntity(liket),
      ),
    };
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
   *라이켓 자세히보기

   @author wherehows
   */
  public async getLiketByIdx(idx: number) {
    const liket = await this.liketRepository.selectLiketByIdx(idx);

    if (!liket) {
      throw new LiketNotFoundException('Cannot find liket');
    }

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
