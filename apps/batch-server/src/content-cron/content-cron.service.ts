import { Injectable, Logger } from '@nestjs/common';
import { CultureContentRepository } from 'apps/batch-server/src/content-cron/culture-content/culture-content.repository';
import {
  EXTERNAL_APIs,
  ExternalAPIs,
} from 'apps/batch-server/src/content-cron/external-api.enum';
import { KopisPerformApiService } from 'apps/batch-server/src/content-cron/external-apis/kopis/kopis-perform-api.service';
import { TourApiService } from 'apps/batch-server/src/content-cron/external-apis/tour/tour-api.service';
import { IExternalApiService } from 'apps/batch-server/src/content-cron/interface/external-api.service';
import { SERVER_TYPE } from 'libs/common/constants/server-type';
import { DiscordService } from 'libs/modules/discord/discord.service';

@Injectable()
export class ContentCronService {
  private readonly externalApiMap: Record<ExternalAPIs, IExternalApiService>;
  private readonly LOG_CONTEXT = 'CONTENT_CRON';

  constructor(
    private readonly logger: Logger,
    private readonly kopisPerformApiService: KopisPerformApiService,
    private readonly cultureContentRepository: CultureContentRepository,
    private readonly tourApiService: TourApiService,
    private readonly discordService: DiscordService,
  ) {
    this.externalApiMap = {
      [EXTERNAL_APIs.KOPIS_PERFORM]: this.kopisPerformApiService,
      [EXTERNAL_APIs.TOUR_FESTIVAL]: this.tourApiService,
    };
  }

  /**
   * @author jochongs
   */
  public async saveContentFromExternalAPI(): Promise<void> {
    const externalApiKeyList = this.extractKeysFromMap(this.externalApiMap);

    for (const externalApiKey of externalApiKeyList) {
      try {
        this.logger.log(
          `External API execute: ${externalApiKey}`,
          this.LOG_CONTEXT,
        );
        const externalApiService = this.externalApiMap[externalApiKey];

        const summaryPerformList = await externalApiService.getSummaryAll();
        this.logger.log(
          `total content count: ${summaryPerformList.length}`,
          this.LOG_CONTEXT,
        );

        let performId: string;
        for (const i in summaryPerformList) {
          const summaryPerform = summaryPerformList[i];
          performId = externalApiService.getId(summaryPerform);
          try {
            this.logger.log(
              `Getting Perform: ${performId} | ${Number(i) + 1}/${
                summaryPerformList.length
              }`,
              this.LOG_CONTEXT,
            );

            const contentId = this.getContentId(performId, externalApiKey);

            const alreadyExistContent =
              await this.cultureContentRepository.selectCultureContentById(
                contentId,
              );

            if (alreadyExistContent) {
              this.logger.log(
                `already exist content | id = ${contentId}`,
                this.LOG_CONTEXT,
              );

              continue;
            }

            const detailPerform = await externalApiService.getDetail(
              summaryPerform,
            );

            const externalApiAdapter = externalApiService.getAdapter();

            const tempContent = await externalApiAdapter.transform(
              detailPerform,
            );

            await this.cultureContentRepository.insertCultureContentWithContentId(
              tempContent,
              contentId,
            );
          } catch (err) {
            await this.handlingError(
              `${externalApiKey}-${performId}: 컨텐츠 상세 정보 불러오는 중 에러 발생`,
              err.message || '',
              err,
            );
          }
        }
        this.logger.log(`Complete ${externalApiKey}`, this.LOG_CONTEXT);
      } catch (err) {
        await this.handlingError(
          `${externalApiKey}: 컨텐츠 목록 불러오는 중 에러 발생`,
          err.message || '',
          err,
        );
      }
    }
  }

  /**
   * 에러 핸들링 메서드
   *
   * @author jochongs
   */
  private async handlingError(
    title: string,
    message: string,
    err: any,
  ): Promise<void> {
    await this.discordService.createErrorLog(
      SERVER_TYPE.BATCH_SERVER,
      title,
      message,
      err,
    );
  }

  /**
   * 맵에서 키 목록을 추출하는 메서드
   *
   * @author jochongs
   */
  private extractKeysFromMap<T extends Record<any, any>>(map: T): (keyof T)[] {
    return Object.keys(map);
  }

  /**
   * 공연 아이디를 반환하는 메서드
   *
   * 공연 아이디는 `${API 맵 키}-${perform_id}`입니다.
   * RDB 컬럼명이 perform_id는 레거시입니다. 추후에 id로 변경이 필요합니다.
   *
   * @author jochongs
   */
  private getContentId(performId: string, key: ExternalAPIs) {
    return `${key}-${performId}` as const;
  }
}
