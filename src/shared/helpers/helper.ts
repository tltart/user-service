export const pickObjKeys = <T, I extends keyof T>(obj: T, ...keys: I[]): Pick<T, I> => {
  const result = {} as Pick<T, I>;
  keys.forEach(key => {
    result[key] = obj[key];
  });
  return result;
};