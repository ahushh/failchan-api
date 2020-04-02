
export type INullable<T> = {
  [P in keyof T]: T[P] | null;
};
