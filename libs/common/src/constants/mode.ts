/**
 * @author jochongs
 */
export const MODE = {
  PRODUCT: 'product',
  DEVELOP: 'develop',
  TEST: 'test',
};

/**
 * @author jochongs
 */
export type Mode = (typeof MODE)[keyof typeof MODE];
