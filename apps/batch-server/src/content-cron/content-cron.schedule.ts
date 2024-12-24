import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import {
  EXTERNAL_APIs,
  ExternalAPIs,
} from 'apps/batch-server/src/content-cron/external-api.enum';
import { KopisPerformApiService } from 'apps/batch-server/src/content-cron/external-apis/kopis/kopis-perform-api.service';
import { IExternalApiService } from 'apps/batch-server/src/content-cron/interface/external-api.service';

@Injectable()
export class ContentCronSchedule {
  private readonly externalApiMap: Record<ExternalAPIs, IExternalApiService>;

  constructor(
    private readonly logger: Logger,
    private readonly kopisPerformApiService: KopisPerformApiService,
  ) {
    this.externalApiMap = {
      [EXTERNAL_APIs.KOPIS_PERFORM]: this.kopisPerformApiService,
    };
  }

  /**
   * 00시 00분 01초에 전날 데이터를 불러오는 API
   *
   * @author jochongs
   */
  @Cron('1 0 0 * * *')
  async contentCronJob() {
    const externalApiKeyList = Object.keys(
      this.externalApiMap,
    ) as ExternalAPIs[];

    for (const externalApiKey of externalApiKeyList) {
      const externalApiService = this.externalApiMap[externalApiKey];

      // TODO: 해야함.
    }
  }
}
