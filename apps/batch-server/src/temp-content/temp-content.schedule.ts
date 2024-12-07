import { Injectable, Logger } from '@nestjs/common';
import { TempContentService } from './temp-content.service';
import { Cron } from '@nestjs/schedule';
import { TempContentPipeService } from './temp-content-pipe.service';
import { TempContentRepository } from './temp-content.repository';
import { RawTempContentEntity } from './entity/raw-temp-content.entity';
import { TempContentEntity } from './entity/temp-content.entity';

@Injectable()
export class TempContentSchedule {
  MODE: 'develop' | 'product' | 'test';

  constructor(
    private readonly tempContentService: TempContentService,
    private readonly tempContentPipeService: TempContentPipeService,
    private readonly tempContentRepository: TempContentRepository,
    private readonly logger: Logger,
  ) {
    this.MODE =
      process.env.MODE === 'develop'
        ? 'develop'
        : process.env.MODE === 'product'
        ? 'product'
        : 'test';
  }

  /**
   * 00시 00분 01초에 전날 데이터를 불러오는 API
   *
   * @author jochongs
   */
  @Cron('1 0 0 * * *')
  async savePerformList() {
    const rawTempContentEntityList =
      await this.tempContentService.getDetailPerformAllUpdatedAfterYesterday();

    for (const i in rawTempContentEntityList) {
      this.logger.log(
        `process: ${Number(i) + 1}/${rawTempContentEntityList.length}`,
        'temp-content-cron',
      );
      const rawTempContentEntity = rawTempContentEntityList[i];
      await this.upsertTempContentEntity(rawTempContentEntity);
    }

    if (this.MODE === 'develop') {
    }
  }

  /**
   * @author jochongs
   */
  private async upsertTempContentEntity(
    rawTempContentEntity: RawTempContentEntity,
  ) {
    try {
      const tempContentEntity =
        await this.tempContentPipeService.createTempContentEntity(
          rawTempContentEntity,
        );

      const tempContent =
        await this.tempContentRepository.selectTempContentById(
          tempContentEntity.id,
        );

      if (this.MODE === 'develop') {
        await this.saveContentByTempContentEntityForDevelop(tempContentEntity);
      }

      if (!tempContent) {
        // 최초 INSERT
        await this.tempContentRepository.insertTempContent(tempContentEntity);
        this.logger.debug(
          'Success saving perform | id = ' + tempContentEntity.id,
          'perform-cron-job',
        );
      } else {
        // 이미 있는 데이터
        await this.tempContentRepository.updateTempContentByIdx(
          tempContent.idx,
          tempContent.locationIdx,
          tempContentEntity,
        );
        this.logger.debug(
          'Success update perform | id = ' + tempContentEntity.id,
          'perform-cron-job',
        );
      }
    } catch (err) {
      this.logger.error(
        'Fail to save content entity | id = ' +
          rawTempContentEntity.perform.mt20id,
        'perform-cron-job',
      );
      console.log(err);
    }
  }

  /**
   * @author jochongs
   */
  private async saveContentByTempContentEntityForDevelop(
    tempEntity: TempContentEntity,
  ) {
    if (this.MODE !== 'develop') return;

    try {
      await this.tempContentRepository.insertContentByTempContentEntityForDevelop(
        tempEntity,
      );
      this.logger.debug(
        'Success to save culture-content',
        'save-content-for-develop',
      );
    } catch (err) {
      this.logger.error(
        'Fail to save | id =' + tempEntity.id,
        'save-content-for-develop',
      );
      console.log(err);
    }
  }
}
