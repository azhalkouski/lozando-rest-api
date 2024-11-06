const toCamelCase = (str: string) =>
  str.replace(/_[a-z]/g, (match) => match[1].toUpperCase());


export function snakeToCamelCaseFields<
  T extends Record<string, any>
>(data: Record<string, any>): T {
  return Object.keys(data).reduce((acc, key) => {
    const camelKey = toCamelCase(key);
    (acc as Record<string, any>)[camelKey] = data[key];
    return acc;
  }, {} as T);
};

export function objectFieldNamesToCamelCase(object: Record<string, any>) {}
