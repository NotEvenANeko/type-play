import { Not, Or } from './boolean';
import {
  GetTuple,
  JoinTuple,
  ProcessInferredType,
  ReverseTuple,
  SplitString,
  TrimTupleZeroLeft,
} from './utils';

export type NumberLike = number | string | bigint;
export type NumberString = string;

export type NumberObjectImpl<
  T extends NumberString,
  Negative extends boolean = false
> = {
  number: T extends '' ? '0' : T;
  neg: T extends '' | '0' ? false : Negative;
};

type NumberStringToNumberObject<T extends NumberString> =
  T extends `-${infer Num}`
    ? NumberObjectImpl<Num, true>
    : NumberObjectImpl<T, false>;

type BooleanToNumberObject<T extends boolean> = NumberObjectImpl<
  T extends true ? '1' : '0'
>;

export type NumberObject<T> = T extends NumberObjectImpl<any, any>
  ? T
  : T extends NumberLike
  ? NumberStringToNumberObject<`${T}`>
  : T extends boolean
  ? BooleanToNumberObject<T>
  : never;

export type NumberObjectToString<T extends NumberObjectImpl<any, any>> =
  `${T['neg'] extends true ? '-' : ''}${T['number']}`;

type NumberAddSimple<
  A extends NumberLike,
  B extends NumberLike
> = ProcessInferredType<[...GetTuple<A>, ...GetTuple<B>]['length'], number>;

type NumberMinusSimpleImpl<
  A extends unknown[],
  B extends unknown[],
  Original = A['length']
> = A extends [unknown, ...infer RestA]
  ? B extends [unknown, ...infer RestB]
    ? NumberMinusSimpleImpl<RestA, RestB, Original>
    : A['length']
  : B extends [unknown, ...unknown[]]
  ? Original
  : 0;

type NumberMinusSimple<
  A extends NumberLike,
  B extends NumberLike
> = NumberMinusSimpleImpl<GetTuple<A>, GetTuple<B>>;

type NumberModularSimple<
  A extends NumberLike,
  B extends NumberLike
> = NumberMinusSimple<A, B> extends infer R
  ? A extends R
    ? A
    : NumberModularSimple<ProcessInferredType<R, number>, B>
  : never;

type NumberDivideSimpleImpl<
  A extends NumberLike,
  B extends NumberLike,
  Res extends unknown[] = []
> = NumberMinusSimple<A, B> extends infer R
  ? A extends R
    ? Res['length']
    : NumberDivideSimpleImpl<
        ProcessInferredType<R, number>,
        B,
        [...Res, unknown]
      >
  : never;

type NumberDivideSimple<
  A extends NumberLike,
  B extends NumberLike
> = NumberDivideSimpleImpl<A, B>;

type NumberPlusSimpleImpl<
  A extends unknown[],
  B extends unknown[],
  Res extends unknown[] = []
> = B['length'] extends 0
  ? Res['length']
  : B extends [unknown, ...infer RestB]
  ? NumberPlusSimpleImpl<A, RestB, [...Res, ...A]>
  : never;

type NumberPlusSimple<
  A extends NumberLike,
  B extends NumberLike
> = NumberPlusSimpleImpl<GetTuple<A>, GetTuple<B>>;

type NumberLessThanSimpleImpl<
  A extends unknown[],
  B extends unknown[]
> = A extends [unknown, ...infer RestA]
  ? B extends [unknown, ...infer RestB]
    ? NumberLessThanSimpleImpl<RestA, RestB>
    : false
  : B extends [unknown, ...unknown[]]
  ? true
  : false;

type NumberLessThanSimple<
  A extends NumberLike,
  B extends NumberLike
> = NumberLessThanSimpleImpl<GetTuple<A>, GetTuple<B>>;

type NumberEqualSimpleImpl<
  A extends unknown[],
  B extends unknown[]
> = A['length'] extends B['length'] ? true : false;

type NumberEqualSimple<
  A extends NumberLike,
  B extends NumberLike
> = NumberEqualSimpleImpl<GetTuple<A>, GetTuple<B>>;

type NumberNotEqualSimple<A extends NumberLike, B extends NumberLike> = Not<
  NumberEqualSimple<A, B>
>;

type NumberLessOrEqualSimple<A extends NumberLike, B extends NumberLike> = Or<
  NumberLessThanSimple<A, B>,
  NumberEqualSimple<A, B>
>;

type NumberGreaterThanSimple<A extends NumberLike, B extends NumberLike> = Not<
  NumberLessOrEqualSimple<A, B>
>;

type NumberGreaterOrEqualSimple<
  A extends NumberLike,
  B extends NumberLike
> = Not<NumberLessThanSimple<A, B>>;

type NumberAddImpl<
  A extends unknown[],
  B extends unknown[],
  Base extends NumberLike = 10,
  Carry extends NumberLike = 0,
  Res extends string[] = []
> = A extends [infer FirstA extends string, ...infer RestA extends string[]]
  ? B extends [infer FirstB extends string, ...infer RestB extends string[]]
    ? NumberAddSimple<
        NumberAddSimple<FirstA, FirstB>,
        Carry
      > extends infer PreAdded
      ? NumberAddImpl<
          RestA,
          RestB,
          Base,
          NumberDivideSimple<ProcessInferredType<PreAdded, number>, Base>,
          [
            ...Res,
            `${NumberModularSimple<
              ProcessInferredType<PreAdded, number>,
              Base
            >}`
          ]
        >
      : never
    : Carry extends 0
    ? [...Res, FirstA, ...RestA]
    : NumberAddImpl<
        RestA,
        [],
        Base,
        NumberDivideSimple<NumberAddSimple<FirstA, Carry>, Base>,
        [...Res, `${NumberModularSimple<NumberAddSimple<FirstA, Carry>, Base>}`]
      >
  : B extends [infer FirstB extends string, ...infer RestB extends string[]]
  ? Carry extends 0
    ? [...Res, FirstB, ...RestB]
    : NumberAddImpl<
        RestB,
        [],
        Base,
        NumberDivideSimple<NumberAddSimple<FirstB, Carry>, Base>,
        [...Res, `${NumberModularSimple<NumberAddSimple<FirstB, Carry>, Base>}`]
      >
  : Carry extends 0
  ? Res
  : [...Res, `${Carry}`];

type NumberAdd<
  A extends NumberLike,
  B extends NumberLike,
  Base extends NumberLike = 10
> = JoinTuple<
  ReverseTuple<
    NumberAddImpl<
      ReverseTuple<SplitString<`${A}`>>,
      ReverseTuple<SplitString<`${B}`>>,
      Base
    >
  >
>;

export type Add<
  A extends NumberLike,
  B extends NumberLike
> = NumberObject<A> extends NumberObjectImpl<infer NumberA, infer NegA>
  ? NumberObject<B> extends NumberObjectImpl<infer NumberB, infer NegB>
    ? NegA extends false
      ? NegB extends false
        ? NumberObjectToString<NumberObjectImpl<NumberAdd<NumberA, NumberB>>>
        : never
      : NegB extends false
      ? never
      : NumberObjectToString<
          NumberObjectImpl<NumberAdd<NumberA, NumberB>, true>
        >
    : never
  : never;

export type Negative<T extends NumberLike> =
  NumberObject<T> extends NumberObjectImpl<infer Number, infer Neg>
    ? NumberObjectToString<NumberObjectImpl<Number, Not<Neg>>>
    : never;

type LessThanOrEqualImpl<
  A extends string[],
  B extends string[],
  Equal extends boolean = false
> = A['length'] extends B['length']
  ? A extends [infer FirstA extends string, ...infer RestA extends string[]]
    ? B extends [infer FirstB extends string, ...infer RestB extends string[]]
      ? Equal extends true
        ? NumberEqualSimple<FirstA, FirstB> extends false
          ? false
          : LessThanOrEqualImpl<RestA, RestB, Equal>
        : NumberLessThanSimple<FirstA, FirstB> extends false
        ? false
        : LessThanOrEqualImpl<RestA, RestB, Equal>
      : true
    : true
  : Equal extends true
  ? NumberEqualSimple<A['length'], B['length']>
  : NumberLessThanSimple<A['length'], B['length']>;

export type LessThan<
  A extends NumberLike,
  B extends NumberLike
> = NumberObject<A> extends NumberObjectImpl<infer NumberA, infer NegA>
  ? NumberObject<B> extends NumberObjectImpl<infer NumberB, infer NegB>
    ? NegA extends false
      ? NegB extends false
        ? LessThanOrEqualImpl<
            SplitString<`${NumberA}`>,
            SplitString<`${NumberB}`>
          >
        : false
      : NegB extends false
      ? true
      : Not<
          LessThanOrEqualImpl<
            SplitString<`${NumberA}`>,
            SplitString<`${NumberB}`>
          >
        >
    : never
  : never;

export type Equal<
  A extends NumberLike,
  B extends NumberLike
> = NumberObject<A> extends NumberObjectImpl<infer NumberA, infer NegA>
  ? NumberObject<B> extends NumberObjectImpl<infer NumberB, infer NegB>
    ? NegA extends NegB
      ? LessThanOrEqualImpl<
          SplitString<`${NumberA}`>,
          SplitString<`${NumberB}`>,
          true
        >
      : false
    : never
  : never;

export type LessOrEqual<A extends NumberLike, B extends NumberLike> = Or<
  Equal<A, B>,
  LessThan<A, B>
>;

export type Greater<A extends NumberLike, B extends NumberLike> = Not<
  LessOrEqual<A, B>
>;

export type GreaterOrEqual<A extends NumberLike, B extends NumberLike> = Not<
  LessThan<A, B>
>;

export type NotEqual<A extends NumberLike, B extends NumberLike> = Not<
  Equal<A, B>
>;

type DivideBy2Impl<
  T extends string[],
  Store extends NumberLike = 0,
  Res extends string[] = []
> = T extends [infer First extends string, ...infer Rest extends string[]]
  ? NumberAddSimple<
      ProcessInferredType<NumberPlusSimple<Store, 10>, number>,
      First
    > extends infer Carry extends number
    ? DivideBy2Impl<
        Rest,
        ModBy2<Carry>,
        [...Res, `${NumberDivideSimple<Carry, 2>}`]
      >
    : never
  : TrimTupleZeroLeft<Res>;

export type DivideBy2<T extends NumberLike> =
  NumberObject<T> extends NumberObjectImpl<infer Number, infer Neg>
    ? NumberObjectToString<
        NumberObjectImpl<JoinTuple<DivideBy2Impl<SplitString<Number>>>, Neg>
      >
    : never;

export type ModBy2<T extends NumberLike> =
  NumberObject<T> extends NumberObjectImpl<infer Number, boolean>
    ? SplitString<Number> extends [...string[], infer Last extends string]
      ? NumberModularSimple<Last, 2>
      : never
    : never;
