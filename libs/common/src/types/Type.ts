/**
 * T의 인스턴스가 아닌, class 그 자체를 의미하는 타입
 *
 * @author jochongs
 */
export interface Type<T = any> extends Function {
  new (...args: any[]): T;
}
