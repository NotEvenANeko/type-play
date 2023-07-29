# Type play

just play with TypeScript

## Boolean

### Not\<T\>

`!T`

### And\<T, U\>

`T && U`

### Or\<T, U\>

`T || U`

### Boolean\<T\>

`''`, `0`, `undefined`, `null` to `false` like JavaScript

## Number

### NumberLike

`string`, `bigint` and `number`

### Add\<A extends NumberLike, B extends NumberLike\>

`A + B` in bigint, but same sign only

### DivideBy2\<T extends NumberLike\>

`T / 2` in bigint

### ModBy2\<T extends NumberLike\>

`T % 2`

### Negative\<T extends NumberLike\>

`-T` in bigint

### LessThan\<A extends NumberLike, B extends NumberLike\>

`A < B`

### Equal\<A extends NumberLike, B extends NumberLike\>

`A == B`

### LessOrEqual\<A extends NumberLike, B extends NumberLike\>

`A <= B`

### Greater\<A extends NumberLike, B extends NumberLike\>

`A > B`

### GreaterOrEqual\<A extends NumberLike, B extends NumberLike\>

`A >= B`

### NotEqual\<A extends NumberLike, B extends NumberLike\>

`A != B`
