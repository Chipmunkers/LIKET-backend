import { Injectable } from '@nestjs/common';
import { KopisPerformApiService } from 'apps/batch-server/src/content-cron/external-apis/kopis/kopis-perform-api.service';

@Injectable()
export class ContentCronService {
  constructor(
    private readonly kopisPerformApiService: KopisPerformApiService,
  ) {}

  public async saveContentFromExternalAPI() {}
}
