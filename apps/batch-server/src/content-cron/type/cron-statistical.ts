import { ExternalAPIs } from 'apps/batch-server/src/content-cron/external-api.enum';

export type CronStatistical = {
  count: Record<
    ExternalAPIs,
    {
      summaryError: number;
      totalCount: number;
      detailErrorCount: number;
      insertCount: number;
      updateCount: number;
    }
  >;
};
