/**
 * KOPIS 오픈 API 사용 설정
 *
 * @author jochongs
 */
export default () => ({
  kopis: {
    keys: (process.env.KOPIS_SERVICE_KEY || '').split(' '),
  } as const,
});
