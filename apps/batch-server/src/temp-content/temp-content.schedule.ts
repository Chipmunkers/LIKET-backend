import { Injectable, Logger } from '@nestjs/common';
import { TempContentService } from './temp-content.service';
import { Cron } from '@nestjs/schedule';
import { TempContentPipeService } from './temp-content-pipe.service';
import { TempContentRepository } from './temp-content.repository';

@Injectable()
export class TempContentSchedule {
  constructor(
    private readonly tempContentService: TempContentService,
    private readonly tempContentPipeService: TempContentPipeService,
    private readonly tempContentRepository: TempContentRepository,
    private readonly logger: Logger,
  ) {}

  @Cron('1 0 0 * * *')
  async savePerformList() {
    const rawTempContentEntityList =
      await this.tempContentService.getDetailPerformAllUpdatedAfterYesterday();

    for (const rawTempContentEntity of rawTempContentEntityList) {
      try {
        const tempContentEntity =
          await this.tempContentPipeService.createTempContentEntity(
            rawTempContentEntity,
          );

        const tempContent =
          await this.tempContentRepository.selectTempContentById(
            tempContentEntity.id,
          );

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
  }
}
