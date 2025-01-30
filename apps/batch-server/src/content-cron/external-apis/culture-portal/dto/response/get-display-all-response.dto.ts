import { CulturePortalErrorCode } from 'apps/batch-server/src/content-cron/external-apis/culture-portal/type/CULTURE_PORTAL_ERROR_CODE';
import { SummaryCulturePortalDisplay } from 'apps/batch-server/src/content-cron/external-apis/culture-portal/type/summary-culture-portal-display';

export class GetDisplayAllResponseDto {
  response: {
    header: {
      resultCode: CulturePortalErrorCode;
      /**
       * !주의: 현재 응답 코드 field에 오타가 있습니다. 문화포털에 문의해야합니다.
       */
      reseultCode: CulturePortalErrorCode;
      resultMsg: string;
    };
    body: {
      /**
       * 총 검색 개수, 숫자로 이루어진 문자로 반환됨
       */
      totalCount: string;
      PageNo: string;
      numOfrows: string;
      items: null | { item: SummaryCulturePortalDisplay[] };
    };
  };
}
