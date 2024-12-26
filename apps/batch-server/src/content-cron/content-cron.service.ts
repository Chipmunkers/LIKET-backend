import { Injectable, Logger } from '@nestjs/common';
import {
  EXTERNAL_APIs,
  ExternalAPIs,
} from 'apps/batch-server/src/content-cron/external-api.enum';
import { KopisPerformApiService } from 'apps/batch-server/src/content-cron/external-apis/kopis/kopis-perform-api.service';
import { IExternalApiService } from 'apps/batch-server/src/content-cron/interface/external-api.service';

@Injectable()
export class ContentCronService {
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
   * @author jochongs
   */
  public async saveContentFromExternalAPI() {
    const externalApiKeyList = this.extractKeysFromMap(this.externalApiMap);

    for (const externalApiKey of externalApiKeyList) {
      const externalApiService = this.externalApiMap[externalApiKey];

      const summaryPerform = await externalApiService.getSummaryAll();
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
}
