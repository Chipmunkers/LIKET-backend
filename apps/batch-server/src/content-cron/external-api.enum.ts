/**
 * 외부 API 목록입니다.
 *
 * @author jochongs
 */
export const EXTERNAL_APIs = {
  KOPIS_PERFORM: 'KP',
  TOUR_FESTIVAL: 'TF',
} as const;

export type ExternalAPIs = (typeof EXTERNAL_APIs)[keyof typeof EXTERNAL_APIs];
