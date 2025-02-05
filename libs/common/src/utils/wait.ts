/**
 * 잠깐 대기하는 함수. await 사용 필수
 *
 * @author jochongs
 *
 * @param ms 기다릴 시간
 */
export const wait = (ms: number) =>
  new Promise((res, rej) => {
    setTimeout(() => {
      res(undefined);
    }, ms);
  });
