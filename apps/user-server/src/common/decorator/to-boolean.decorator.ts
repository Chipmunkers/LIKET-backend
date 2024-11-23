import { Transform } from 'class-transformer';

export const ToBoolean = () => {
  return Transform((value) => {
    if (!['true', 'false'].includes(value.value)) {
      return value.value;
    }

    return value.value == 'true';
  });
};
