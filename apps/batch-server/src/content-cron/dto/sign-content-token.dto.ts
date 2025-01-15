import {
  EXTERNAL_APIs,
  ExternalAPIs,
} from 'apps/batch-server/src/content-cron/external-api.enum';
import { IsIn, IsString, Length } from 'class-validator';

/**
 * @author jochongs
 */
export class SignContentTokenDto {
  @IsString()
  @IsIn(Object.keys(EXTERNAL_APIs).map((key) => EXTERNAL_APIs[key]))
  key: ExternalAPIs;

  /**
   * 공연 아이디 (컨텐츠 아이디가 아님에 주의)
   */
  @IsString()
  @Length(1, 200)
  id: string;
}
