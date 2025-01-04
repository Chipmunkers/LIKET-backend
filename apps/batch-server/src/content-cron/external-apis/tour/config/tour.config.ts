/**
 * TOUR 오픈 API 사용 설정
 *
 * @author jochongs
 *
 * @link https://api.visitkorea.or.kr/#/useOpenapiManual
 */
export default () => ({
  tour: {
    key: process.env.TOUR_API_KEY,
  } as const,
});
