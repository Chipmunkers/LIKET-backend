import { GENRE_CODE } from '../../type/GENRE_CODE';

/**
 * @author jochongs
 */
export type GetPerformAllDto =
  | {
      /**
       * 공연 시작일
       *
       * @example 20230108
       */
      stdate: string;

      /**
       * 공연 종료일
       * (최대 31일) => 무슨 뜻인지 모르겠음
       *
       * @example 20230112
       */
      eddate: string;

      /**
       * 현재 페이지
       *
       * @example 1
       */
      cpage: number;

      /**
       * 페이지당 목록 수
       * 최대 100건
       *
       * @example 1
       */
      rows: number;

      /**
       * 장르 코드
       *
       * @example `GENRE_CODE.THEATER`
       */
      shcate?: GENRE_CODE;

      /**
       * 공연명
       *
       * @example 사랑
       */
      shprfnm?: string;

      /**
       * 해당일자 이후 등록/수정된 항목만 출력
       *
       * @example 20230101
       */
      afterdate?: string;
    }
  | {
      /**
       * 현재 페이지
       *
       * @example 1
       */
      cpage: number;

      /**
       * 페이지당 목록 수
       * 최대 100건
       *
       * @example 1
       */
      rows: number;

      /**
       * 장르 코드
       *
       * @example `GENRE_CODE.THEATER`
       */
      shcate?: GENRE_CODE;

      /**
       * 공연명
       *
       * @example 사랑
       */
      shprfnm?: string;

      /**
       * 해당일자 이후 등록/수정된 항목만 출력
       *
       * @example 20230101
       */
      afterdate: string;
    };
