type Stringify = number | string | bigint;
export type BinaryDigits = 0 | 1;

export type Getter<T, K extends keyof T> = T[K];

export type GetTuple<
  Length extends Stringify,
  Elem = unknown,
  Res extends unknown[] = []
> = `${Res['length']}` extends `${Length}`
  ? Res
  : GetTuple<Length, Elem, [...Res, Elem]>;

export type SplitString<
  T extends string,
  Res extends string[] = []
> = T extends `${infer First}${infer Rest}`
  ? SplitString<Rest, [...Res, First]>
  : Res;

export type JoinTuple<
  T extends Stringify[],
  Res extends string = ''
> = T extends [infer First extends Stringify, ...infer Rest extends Stringify[]]
  ? JoinTuple<Rest, `${Res}${First}`>
  : Res;

export type ReverseTuple<
  T extends unknown[],
  Res extends unknown[] = []
> = T extends [infer First, ...infer Rest]
  ? ReverseTuple<Rest, [First, ...Res]>
  : Res;

export type ProcessInferredType<T, Type> = T extends Type ? T : never;

export type TrimTupleZeroLeft<T extends string[]> = T extends [
  '0',
  ...infer Rest
]
  ? TrimTupleZeroLeft<ProcessInferredType<Rest, string[]>>
  : T;

export type TrimTupleZeroRight<T extends string[]> = T extends [
  ...infer Rest,
  '0'
]
  ? TrimTupleZeroRight<ProcessInferredType<Rest, string[]>>
  : T;

export type TrimTupleZero<T extends string[]> = TrimTupleZeroLeft<
  TrimTupleZeroRight<T>
>;

export type If<Condition extends boolean, True, False> = Condition extends true
  ? True extends any
    ? True
    : never
  : False extends any
  ? False
  : never;

export type PaddingTupleLeftTo<
  Length extends number,
  Tuple extends unknown[],
  Elem = unknown
> = Tuple['length'] extends Length
  ? Tuple
  : PaddingTupleLeftTo<Length, [Elem, ...Tuple], Elem>;
