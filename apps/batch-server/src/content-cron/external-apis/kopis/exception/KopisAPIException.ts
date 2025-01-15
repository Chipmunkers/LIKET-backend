import { KopisErrorResponseDto } from '../dto/response/kopis-error-response.dto';

/**
 * @author jochongs
 */
export class KopisAPIException extends Error {
  returncode: string | null;
  errmsg: string | null;
  responsesettime: string | null;

  constructor(message: string, response: KopisErrorResponseDto) {
    super(message);
    this.returncode = response.dbs?.db.returncode || null;
    this.errmsg = response.dbs?.db.errmsg || null;
    this.responsesettime = response.dbs?.db.responsesettime || null;
  }
}
