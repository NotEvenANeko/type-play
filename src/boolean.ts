export type Not<T> = T extends true ? false : true;
export type And<T extends boolean, U extends boolean> = T extends true
  ? U
  : false;
export type Or<T extends boolean, U extends boolean> = T extends true
  ? true
  : U;

export type Boolean<T> = T extends boolean
  ? T
  : T extends string
  ? T extends ''
    ? false
    : true
  : T extends number
  ? T extends 0
    ? false
    : true
  : T extends undefined
  ? false
  : T extends null
  ? false
  : true;
