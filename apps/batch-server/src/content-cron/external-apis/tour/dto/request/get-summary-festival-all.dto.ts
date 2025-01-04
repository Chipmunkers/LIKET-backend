/**
 * Tour API 요청 시 필요한 DTO
 *
 * @author jochongs
 */
export class GetSummaryFestivalAllDto {
  /**
   * 페이지 당 row 개수, 개수 제한이 없어보임
   */
  numOfRows: number;

  /**
   * 페이지 번호
   */
  pageNo: number;

  /**
   * 운영체제 구분
   *
   * @default ETC
   */
  MobileOS?: 'IOS' | 'AND' | 'WIN' | 'ETC';

  /**
   * 서비스 명
   *
   * @default LIKET
   */
  MobileApp?: string;

  /**
   * 컨텐츠 변경 일자 YYYYMMDD
   */
  modifiedtime: string;

  /**
   * 목록 구분
   */
  listYN?: 'Y' | 'N';

  /**
   * 정렬 구분 (A=제목순, C=수정일순, D=생성일순)
   * 대표이미지가 반드시 있는 정렬 (O=제목순, Q=수정일순, R=생성일순)
   */
  arrange?: 'A' | 'C' | 'D' | 'O' | 'Q' | 'R';
}
