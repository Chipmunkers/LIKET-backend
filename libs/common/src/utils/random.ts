export const getRandomValueFromConstant = <T extends Record<any, any>>(
  data: T,
): T[keyof T] => {
  const keys = Object.keys(data);

  if (keys.length === 0) {
    throw new Error('The provided constant is empty');
  }

  const randomKey = keys[getRandomIndexFromArray(keys)];

  return data[randomKey];
};

export const getRandomIndexFromArray = (list: Array<unknown>) => {
  if (!list.length) {
    throw new Error('Provided array is empty');
  }

  return Math.floor(Math.random() * list.length);
};
