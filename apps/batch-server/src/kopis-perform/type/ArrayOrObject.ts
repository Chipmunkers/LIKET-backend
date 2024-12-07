/**
 * XML 파싱할 때 단일 값인 경우 배열로 판단하지 않음.
 *
 * @author jochongs
 */
export type ArrayOrObject<T> = T[] | T;
