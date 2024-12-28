export const GET_MODE = (): Mode => {
  const mode = process.env.MODE;

  if (!mode) {
    throw new Error('No mode was set up');
  }

  const validModeListKeys = Object.keys(MODE);
  if (!validModeListKeys.map((key) => MODE[key]).includes(mode)) {
    throw new Error(`Invalid mode. mode = ${mode}`);
  }

  return mode;
};

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
