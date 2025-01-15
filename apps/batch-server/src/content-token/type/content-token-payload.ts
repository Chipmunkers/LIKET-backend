import { ExternalAPIs } from 'apps/batch-server/src/content-cron/external-api.enum';

/**
 * @author jochongs
 */
export type ContentTokenPayload = {
  key: ExternalAPIs;
  /**
   * 공연 아이디.
   * content id가 아님에 주의
   */
  id: string;
};
