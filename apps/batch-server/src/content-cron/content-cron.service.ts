import { Injectable, Logger } from '@nestjs/common';
import { CultureContentRepository } from 'apps/batch-server/src/content-cron/culture-content/culture-content.repository';
import {
  EXTERNAL_APIs,
  ExternalAPIs,
} from 'apps/batch-server/src/content-cron/external-api.enum';
import { KopisPerformApiService } from 'apps/batch-server/src/content-cron/external-apis/kopis/kopis-perform-api.service';
import { IExternalApiService } from 'apps/batch-server/src/content-cron/interface/external-api.service';

@Injectable()
export class ContentCronService {
  private readonly externalApiMap: Record<ExternalAPIs, IExternalApiService>;
  private readonly LOG_CONTEXT = 'CONTENT_CRON';

  constructor(
    private readonly logger: Logger,
    private readonly kopisPerformApiService: KopisPerformApiService,
    private readonly cultureContentRepository: CultureContentRepository,
  ) {
    this.externalApiMap = {
      [EXTERNAL_APIs.KOPIS_PERFORM]: this.kopisPerformApiService,
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

        for (const i in summaryPerformList) {
          const summaryPerform = summaryPerformList[i];
          const performId = externalApiService.getId(summaryPerform);
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

            // TODO: TempContent의 id필드가 매우 모호한 상태.
            // DB에는 perform_id라고 되어있는 컬럼 명을 그냥 id로 바꾸어야함.
            // 그러나 변경 시 schema.prisma와 동시에 변경되어야해서 아직 바꾸지 못함.
            // perform id와 content id를 명확하게 해야함
            await this.cultureContentRepository.insertCultureContentWithContentId(
              tempContent,
              contentId,
            );
          } catch (err) {
            this.logger.error(
              `Fail to Getting perform | ${performId}`,
              err?.stack || '',
              this.LOG_CONTEXT,
            );
          }
        }
      } catch (err) {
        this.logger.error(
          `Fail to Request External | API: ${externalApiKey}`,
          err?.stack || '',
          this.LOG_CONTEXT,
        );
        console.log(err);
      }
    }
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
