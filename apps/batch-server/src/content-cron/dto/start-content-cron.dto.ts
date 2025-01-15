import {
  EXTERNAL_APIs,
  ExternalAPIs,
} from 'apps/batch-server/src/content-cron/external-api.enum';
import { IsIn, IsString } from 'class-validator';

/**
 * @author jochongs
 */
export class StartContentCronDto {
  // @IsString()
  // @IsIn(Object.keys(EXTERNAL_APIs).map((key) => EXTERNAL_APIs[key]))
  // key: ExternalAPIs;

  @IsString()
  pw: string;
}
