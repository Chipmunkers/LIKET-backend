import { Injectable } from '@nestjs/common';
import { ExhibitionEntity } from 'apps/batch-server/src/content-cron/external-apis/culture-portal/entity/exhibition.entity';
import { SummaryExhibitionEntity } from 'apps/batch-server/src/content-cron/external-apis/culture-portal/entity/summary-display.entity';
import { CulturePortalProvider } from 'apps/batch-server/src/content-cron/external-apis/culture-portal/provider/culture-portal.provider';
import { IExternalApiAdapterService } from 'apps/batch-server/src/content-cron/interface/external-api-adapter.service';
import { IExternalApiService } from 'apps/batch-server/src/content-cron/interface/external-api.service';

@Injectable()
export class CulturePortalService
  implements IExternalApiService<SummaryExhibitionEntity, ExhibitionEntity>
{
  constructor(private readonly culturePortalProvider: CulturePortalProvider) {}

  getSummaryAll(): Promise<SummaryExhibitionEntity[]> {
    throw new Error('Method not implemented.');
  }
  getDetail(data: SummaryExhibitionEntity): Promise<ExhibitionEntity> {
    throw new Error('Method not implemented.');
  }
  getAdapter(): IExternalApiAdapterService<ExhibitionEntity> {
    throw new Error('Method not implemented.');
  }
  getId(data: SummaryExhibitionEntity): string {
    throw new Error('Method not implemented.');
  }
  getDetailById(performId: string): Promise<ExhibitionEntity> {
    throw new Error('Method not implemented.');
  }
}
