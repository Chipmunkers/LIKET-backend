/**
 * 객체의 랜덤 값 여러 개를 뽑아오는 메서드
 * 중복 가능 여부는 옵션을 통해 제어하십시오.
 *
 * @author jochongs
 */
export const getRandomValuesFromConstant = <T extends Record<any, any>>(
  data: T,
  count: number,
  options: {
    duplicate?: boolean;
  } = {},
): T[keyof T][] => {
  const keys = [...Object.keys(data)]; // 원본 데이터 수정 방지

  if (!options.duplicate && keys.length < count) {
    throw new Error('Requested count exceeds the number of available items.');
  }

  const valueList: T[keyof T][] = [];
  const usedIndices = new Set<number>();

  while (valueList.length < count) {
    const randomIndex = getRandomIndexFromArray(keys);

    if (!options.duplicate && usedIndices.has(randomIndex)) {
      continue;
    }

    valueList.push(data[keys[randomIndex]]);
    usedIndices.add(randomIndex);

    if (!options.duplicate) {
      keys.splice(randomIndex, 1);
    }
  }

  return valueList;
};

/**
 * 객체의 랜덤 값 하나를 뽑아오는 메서드
 *
 * @author jochongs
 */
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

/**
 * 배열의 랜덤 키 값을 뽑아오는 메서드
 */
export const getRandomIndexFromArray = (list: Array<unknown>) => {
  if (!list.length) {
    throw new Error('Provided array is empty');
  }

  return Math.floor(Math.random() * list.length);
};
