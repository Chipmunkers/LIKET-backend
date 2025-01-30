/**
 * open api에서 키 검증 에러가 발생한 경우 발생하는 에러
 *
 * @author jochongs
 */
export class GetDisplayAllErrorResponseDto {
  OpenAPI_ServiceResponse: {
    cmmMsgHeader: {
      errMsg: string;
      returnAuthMsg: string;
      returnReasonCode: string;
    };
  };
}
