import { TempContentEntity } from 'apps/batch-server/src/content-cron/culture-content/entity/temp-content.entity';

export type UpdateContentInfo = Pick<
  TempContentEntity,
  'description' | 'openTime' | 'startDate' | 'endDate' | 'location'
>;
