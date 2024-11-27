/**
 * 앱 구동 모드를 확인하는 메서드. 해당 메서드는 직접 사용하라고 만들어진 메서드가 아닙니다.
 * 반드시 ConfigModule을 사용하여 값을 가져와야합니다.
 *
 * @author jochongs
 */
export default () => ({
  mode: process.env.MODE || 'develop',
});
