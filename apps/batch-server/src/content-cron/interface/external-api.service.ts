import { IExternalApiAdapterService } from 'apps/batch-server/src/content-cron/interface/external-api-adapter.service';

/**
 * 외부 API로 컨텐츠 데이터를 가져오는 서비스 인터페이스
 * 해당 인터페이스 구현체는 반드시 T와 U를 사용하여 구현하도록 해야함
 *
 * @author jochongs
 */
export interface IExternalApiService<Summary = any, Detail = any> {
  /**
   * API에서 제공하는 목록을 보는 API
   *
   * 매일 00시 00분 01초에 작동하는 메서드
   */
  getSummaryAll(): Promise<Summary[]>;

  /**
   * 요약을 토대로 Detail 정보를 받아오는 메서드
   */
  getDetail(data: Summary): Promise<Detail>;

  /**
   * 어댑터 가져오는 메서드
   */
  getAdapter(): IExternalApiAdapterService<Detail>;

  /**
   *
   */
  getId(data: Summary): string;
}
