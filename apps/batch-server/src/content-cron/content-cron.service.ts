import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { CultureContentRepository } from 'apps/batch-server/src/content-cron/culture-content/culture-content.repository';
import { InsertContentDto } from 'apps/batch-server/src/content-cron/dto/insert-content.dto';
import { SignContentTokenDto } from 'apps/batch-server/src/content-cron/dto/sign-content-token.dto';
import { AlreadyExistContentException } from 'apps/batch-server/src/content-cron/exception/AlreadyExistContentException';
import {
  EXTERNAL_APIs,
  ExternalAPIs,
} from 'apps/batch-server/src/content-cron/external-api.enum';
import { KopisPerformApiService } from 'apps/batch-server/src/content-cron/external-apis/kopis/kopis-perform-api.service';
import { TourApiService } from 'apps/batch-server/src/content-cron/external-apis/tour/tour-api.service';
import { IExternalApiService } from 'apps/batch-server/src/content-cron/interface/external-api.service';
import { CronStatistical } from 'apps/batch-server/src/content-cron/type/cron-statistical';
import { ContentTokenService } from 'apps/batch-server/src/content-token/content-token.service';
import { GET_MODE, MODE, Mode } from 'libs/common';
import { SERVER_TYPE } from 'libs/common/constants/server-type';
import { DiscordService } from 'libs/modules/discord/discord.service';

@Injectable()
export class ContentCronService {
  private readonly externalApiMap: Record<ExternalAPIs, IExternalApiService>;
  private readonly LOG_CONTEXT = 'CONTENT_CRON';
  private readonly MODE: Mode;
  private readonly BATCH_SERVER_DOMAIN: string;

  constructor(
    private readonly logger: Logger,
    private readonly kopisPerformApiService: KopisPerformApiService,
    private readonly cultureContentRepository: CultureContentRepository,
    private readonly tourApiService: TourApiService,
    private readonly discordService: DiscordService,
    private readonly contentTokenService: ContentTokenService,
    private readonly configService: ConfigService,
  ) {
    this.externalApiMap = {
      [EXTERNAL_APIs.KOPIS_PERFORM]: this.kopisPerformApiService,
      [EXTERNAL_APIs.TOUR_FESTIVAL]: this.tourApiService,
    };
    this.MODE = GET_MODE();
    this.BATCH_SERVER_DOMAIN = this.configService.get('domain').batchServer;
  }

  /**
   * @author jochongs
   */
  public async saveContentFromExternalAPI(): Promise<void> {
    const externalApiKeyList = this.extractKeysFromMap(this.externalApiMap);

    const data = this.getStatisticalInit();

    for (const externalApiKey of externalApiKeyList) {
      try {
        const externalApiService = this.externalApiMap[externalApiKey];

        const summaryPerformList = await externalApiService.getSummaryAll();
        data.count[externalApiKey].totalCount += summaryPerformList.length;

        let performId: string;
        for (const i in summaryPerformList) {
          const summaryPerform = summaryPerformList[i];
          performId = externalApiService.getId(summaryPerform);

          try {
            const contentId = this.getContentId(performId, externalApiKey);

            const alreadyExistContent =
              await this.cultureContentRepository.selectCultureContentById(
                contentId,
              );

            const externalApiAdapter = externalApiService.getAdapter();

            const detailPerform = await externalApiService.getDetail(
              summaryPerform,
            );

            if (alreadyExistContent) {
              data.count[externalApiKey].updateCount += 1;
              const updateInfo = await externalApiAdapter.extractUpdateData(
                detailPerform,
              );

              await this.cultureContentRepository.updateContentById(
                updateInfo,
                contentId,
              );
              continue;
            }

            const tempContent = await externalApiAdapter.transform(
              detailPerform,
            );

            await this.cultureContentRepository.insertCultureContentWithContentId(
              tempContent,
              contentId,
            );

            data.count[externalApiKey].insertCount += 1;
          } catch (err) {
            data.count[externalApiKey].detailErrorCount += 1;
            await this.handlingError(
              `${externalApiKey}-${performId}: 컨텐츠 상세 정보 불러오는 중 에러 발생`,
              err.message || '',
              err,
            );
          }
        }
        this.logger.log(`Complete ${externalApiKey}`, this.LOG_CONTEXT);
      } catch (err) {
        data.count[externalApiKey].summaryError += 1;
        await this.handlingSummaryPerformError(externalApiKey, err);
      }
    }

    await this.handlingStatistical(data);
  }

  /**
   * 공연 목록 보기 핸들링 메서드.
   * 공연 목록을 불러오는 중 발생한 에러를 핸들링하는 메서드
   *
   * @author jochongs
   */
  private async handlingSummaryPerformError(
    externalApiKey: ExternalAPIs,
    err: any,
  ) {
    const curl = `curl -X POST "${this.BATCH_SERVER_DOMAIN}/content/cron/all" -H "Content-Type: application/json" -d '{ "pw": "" }'`;

    await this.handlingError(
      `${externalApiKey}: 컨텐츠 목록 불러오는 중 에러 발생`,
      `${err.message || ''}\n\`\`\`\n${curl}\`\`\``,
      err,
    );
  }

  /**
   * 통계 초기값 가져오기
   *
   * @author jochongs
   */
  private getStatisticalInit(): CronStatistical {
    return {
      count: {
        [EXTERNAL_APIs.KOPIS_PERFORM]: {
          summaryError: 0,
          totalCount: 0,
          detailErrorCount: 0,
          insertCount: 0,
          updateCount: 0,
        },
        [EXTERNAL_APIs.TOUR_FESTIVAL]: {
          summaryError: 0,
          totalCount: 0,
          detailErrorCount: 0,
          insertCount: 0,
          updateCount: 0,
        },
      },
    };
  }

  /**
   * 컨텐츠 아이디를 통해 컨텐츠를 upsert하는 메서드
   * Controller를 통해 사용하기 위함.
   *
   * @author jochongs
   */
  private async upsertContentById(
    externalApiKey: ExternalAPIs,
    performId: string,
  ): Promise<'update' | 'insert'> {
    const externalApiService = this.externalApiMap[externalApiKey];

    const contentId = this.getContentId(performId, externalApiKey);

    const alreadyExistContent =
      await this.cultureContentRepository.selectCultureContentById(contentId);

    const detailPerform = await externalApiService.getDetailById(performId);

    const externalApiAdapter = externalApiService.getAdapter();

    if (alreadyExistContent) {
      const updateInfo = await externalApiAdapter.extractUpdateData(
        detailPerform,
      );

      await this.cultureContentRepository.updateContentById(
        updateInfo,
        contentId,
      );

      return 'update';
    }

    const tempContent = await externalApiAdapter.transform(detailPerform);

    await this.cultureContentRepository.insertCultureContentWithContentId(
      tempContent,
      contentId,
    );

    return 'insert';
  }

  /**
   * @author jochongs
   */
  public async insertContentByToken(
    dto: InsertContentDto,
  ): Promise<'update' | 'insert'> {
    const payload = await this.contentTokenService.verifyToken(dto.token);

    const result = await this.upsertContentById(payload.key, payload.id);

    return result;
  }

  /**
   * @author jochongs
   */
  public async signContentToken(dto: SignContentTokenDto): Promise<string> {
    return await this.contentTokenService.signToken(dto);
  }

  /**
   * DB에 저장된 컨텐츠를 다시 cron 하는 메서드
   *
   * @author jochongs
   */
  public async recronKPContentsAll() {
    const KopisContents =
      await this.cultureContentRepository.selectCultureContentByExternalApiKey(
        EXTERNAL_APIs.KOPIS_PERFORM,
      );

    for (let i = 0; i < KopisContents.length; i++) {
      const kopisContent = KopisContents[i];
      try {
        if (!kopisContent.id) {
          this.logger.error('Cannot find kopis content');
          continue;
        }

        await this.upsertContentById(
          EXTERNAL_APIs.KOPIS_PERFORM,
          kopisContent.id.split('-')[1],
        );
      } catch (err) {
        await this.handlingError(
          'content recron error',
          `ID: ${kopisContent.id}`,
          err,
        );
      }
    }
  }

  /**
   * 통계 핸들링
   *
   * @author jochongs
   */
  private async handlingStatistical(data: CronStatistical): Promise<void> {
    if (this.MODE !== MODE.PRODUCT) {
      return;
    }

    const kopisData = data.count[EXTERNAL_APIs.KOPIS_PERFORM];
    const tourData = data.count[EXTERNAL_APIs.TOUR_FESTIVAL];

    await this.discordService.createContentsLog(
      `
### KOPIS API 호출 결과
  (**${
    kopisData.summaryError + kopisData.detailErrorCount === 0
      ? '에러 없음'
      : '에러 있음'
  }**)
* 목록 보기 에러: ${kopisData.summaryError}
* 총 데이터 수집 개수: ${kopisData.totalCount}
      ㄴ 성공 개수: ${kopisData.insertCount}
      ㄴ 중복 개수: ${kopisData.updateCount}
      ㄴ 에러 개수: ${kopisData.detailErrorCount}
### TOUR API 호출 결과
  (**${
    tourData.summaryError + tourData.detailErrorCount === 0
      ? '에러 없음'
      : '에러 있음'
  }**)
* 목록 보기 에러: ${kopisData.summaryError}
* 총 데이터 수집 개수: ${tourData.totalCount}
      ㄴ 성공 개수: ${tourData.insertCount}
      ㄴ 중복 개수: ${tourData.updateCount}
      ㄴ 에러 개수: ${tourData.detailErrorCount}
      `,
    );
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
    if (this.MODE !== MODE.PRODUCT) {
      return;
    }

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
