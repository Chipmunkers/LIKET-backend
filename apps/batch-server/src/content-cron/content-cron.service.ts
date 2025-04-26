import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InsertContentDto } from 'apps/batch-server/src/content-cron/dto/insert-content.dto';
import { SignContentTokenDto } from 'apps/batch-server/src/content-cron/dto/sign-content-token.dto';
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
import { CultureContentCoreService } from 'libs/core/culture-content/culture-content-core.service';
import { Age } from 'libs/core/tag-root/age/constant/age';
import { Genre } from 'libs/core/tag-root/genre/constant/genre';
import { Style } from 'libs/core/tag-root/style/constant/style';
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
    private readonly tourApiService: TourApiService,
    private readonly discordService: DiscordService,
    private readonly contentTokenService: ContentTokenService,
    private readonly configService: ConfigService,
    private readonly cultureContentCoreService: CultureContentCoreService,
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
              await this.cultureContentCoreService.findCultureContentById(
                contentId,
              );

            const externalApiAdapter = externalApiService.getAdapter();

            const detailPerform =
              await externalApiService.getDetail(summaryPerform);

            if (alreadyExistContent) {
              data.count[externalApiKey].updateCount += 1;
              const updateInfo =
                await externalApiAdapter.extractUpdateData(detailPerform);

              await this.cultureContentCoreService.updateCultureContentByIdx(
                alreadyExistContent.idx,
                {
                  description: updateInfo.description,
                  openTime: updateInfo.openTime,
                  startDate: updateInfo.startDate,
                  endDate: updateInfo.endDate,
                  location: updateInfo.location,
                },
              );

              continue;
            }

            const tempContent =
              await externalApiAdapter.transform(detailPerform);

            await this.cultureContentCoreService.createCultureContent({
              id: contentId,
              genreIdx: tempContent.genreIdx as Genre,
              location: {
                address: tempContent.location.address,
                detailAddress: tempContent.location.detailAddress,
                bCode: tempContent.location.bCode,
                hCode: tempContent.location.hCode,
                positionX: tempContent.location.positionX,
                positionY: tempContent.location.positionY,
                region1Depth: tempContent.location.region1Depth,
                region2Depth: tempContent.location.region2Depth,
              },
              ageIdx: tempContent.ageIdx as Age,
              authorIdx: 1, // TODO: admin enum으로 관리해야함
              styleIdxList: tempContent.styleIdxList as Style[],
              title: tempContent.title,
              imgList: tempContent.imgList,
              description: tempContent.description,
              websiteLink: tempContent.websiteLink,
              startDate: tempContent.startDate,
              endDate: tempContent.endDate,
              openTime: tempContent.openTime,
              isFee: tempContent.isFee,
              isReservation: tempContent.isReservation,
              isParking: tempContent.isParking,
              isPet: tempContent.isPet,
            });

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
      await this.cultureContentCoreService.findCultureContentById(contentId);

    const detailPerform = await externalApiService.getDetailById(performId);

    const externalApiAdapter = externalApiService.getAdapter();

    if (alreadyExistContent) {
      const updateInfo =
        await externalApiAdapter.extractUpdateData(detailPerform);

      await this.cultureContentCoreService.updateCultureContentByIdx(
        alreadyExistContent.idx,
        {
          description: updateInfo.description,
          openTime: updateInfo.openTime,
          startDate: updateInfo.startDate,
          endDate: updateInfo.endDate,
          location: updateInfo.location,
        },
      );

      return 'update';
    }

    const tempContent = await externalApiAdapter.transform(detailPerform);

    await this.cultureContentCoreService.createCultureContent({
      id: contentId,
      genreIdx: tempContent.genreIdx as Genre,
      location: {
        address: tempContent.location.address,
        detailAddress: tempContent.location.detailAddress,
        bCode: tempContent.location.bCode,
        hCode: tempContent.location.hCode,
        positionX: tempContent.location.positionX,
        positionY: tempContent.location.positionY,
        region1Depth: tempContent.location.region1Depth,
        region2Depth: tempContent.location.region2Depth,
      },
      ageIdx: tempContent.ageIdx as Age,
      authorIdx: 1, // TODO: admin enum으로 관리해야함
      styleIdxList: tempContent.styleIdxList as Style[],
      title: tempContent.title,
      imgList: tempContent.imgList,
      description: tempContent.description,
      websiteLink: tempContent.websiteLink,
      startDate: tempContent.startDate,
      endDate: tempContent.endDate,
      openTime: tempContent.openTime,
      isFee: tempContent.isFee,
      isReservation: tempContent.isReservation,
      isParking: tempContent.isParking,
      isPet: tempContent.isPet,
    });

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
   * 통계 핸들링
   *
   * @author jochongs
   */
  private async handlingStatistical(data: CronStatistical): Promise<void> {
    if (this.MODE !== MODE.PRODUCT) {
      console.log(data);
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
