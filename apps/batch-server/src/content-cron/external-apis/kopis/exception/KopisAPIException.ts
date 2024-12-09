import { KopisErrorResponseDto } from '../dto/response/kopis-error-response.dto';

/**
 * @author jochongs
 */
export class KopisAPIException extends Error {
  returncode: string;
  errmsg: string;
  responsesettime: string;

  constructor(message: string, response: KopisErrorResponseDto) {
    super(message);
    this.returncode = response.dbs.db.returncode;
    this.errmsg = response.dbs.db.errmsg;
    this.responsesettime = response.dbs.db.responsesettime;
  }
}
