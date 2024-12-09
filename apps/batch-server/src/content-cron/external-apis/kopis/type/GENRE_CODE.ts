/**
 * KOPIS 공연예술 API 장르 코드 목록
 *
 * @author jochongs
 */
export const GENRE_CODE = {
  /**
   * 연극
   */
  THEATER: 'AAAA',

  /**
   * 무용
   */
  DANCE: 'BBBC',

  /**
   * 대중무용
   */
  POPULAR_DANCE: 'BBBE',

  /**
   * 서양음악
   */
  WESTERN_MUSIC: 'CCCA',

  /**
   * 한국음악
   */
  KOREAN_MUSIC: 'CCCC',

  /**
   * 대중음악
   */
  POPULAR_MUSIC: 'CCCD',

  /**
   * 복합
   */
  COMPLEX: 'EEEA',

  /**
   * 서커스/마술
   */
  CIRCUS_MAGIC: 'EEEB',

  /**
   * 뮤지컬
   */
  MUSICAL: 'GGGA',
} as const;

export type GENRE_CODE = (typeof GENRE_CODE)[keyof typeof GENRE_CODE];
