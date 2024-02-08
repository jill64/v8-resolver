export const nonNullable = <T>(x: T): x is NonNullable<T> =>
  x !== null && x !== undefined
