/**
    * @author jochongs
    * 
    에러 코드는 다음과 같습니다.
    00 : NORMAL SERVICE
    01 : APPLICATION ERROR
    02 : DB_ERROR
    03 : NODATA ERROR
    04 : HTTP ERROR
    05 : SERVICE TIMEOUT ERROR
    10 : INVALID REQUEST PARAMETER ERROR
    11 : MANDATORY REQUEST PARAMETERS ERROR
    12 : NO OPENAPI SERVICE ERROR
    20 : SERVICE ACCESS DENIED ERROR
    21 : TEMPORARILY DISABLE THE SERVICE KEY ERROR
    22 : LIMITED NUMBER OF SERVICE REQUESTS EXCEEDS ERROR
    30 : SERVICE KEY IS NOT REGISTERED ERROR
    31 : DEADLINE HAS EXPIRED ERROR
    32 : UNREGISTERED IP ERROR
    33 : UNSIGNED CALL ERROR
    99 : UNKNOWN ERROR
 */
export class FailToRequestCulturePortalException extends Error {
  public code: string;
  public err: any;
  public seq?: string;

  constructor(message: string, code: string, err?: any, seq?: string) {
    super(message);
    this.code = code;
    this.seq = seq;
    this.err = err;
  }
}
