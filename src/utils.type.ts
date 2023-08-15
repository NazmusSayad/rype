export type ValidObject = { [i: string]: unknown }
export type ValidConstructor = new (...args: any[]) => any

export type Prettify<T> = {
  [Key in keyof T]: T[Key]
} & {}

export type Mutable<T> = {
  -readonly [K in keyof T]: T[K]
}

export type ConvertObjectToUnion<T> = T[keyof T]

export type HasUndefined<T> = (T extends undefined ? true : false) extends false
  ? false
  : true

export type MakeOptional<TObject> = {
  [K in keyof TObject as HasUndefined<TObject[K]> extends true
    ? never
    : K]: TObject[K]
} & {
  [K in keyof TObject as HasUndefined<TObject[K]> extends false
    ? never
    : K]?: TObject[K]
}

export type TupleHasDuplicates<T extends readonly any[]> = T extends []
  ? false
  : T extends [infer Head, ...infer Rest]
  ? Head extends Rest[number]
    ? true
    : TupleHasDuplicates<Rest>
  : false

export type ExtractPlaceholderValues<T extends string> =
  T extends `${infer Start}<$${infer Value}$>${infer Rest}`
    ? Value | ExtractPlaceholderValues<Rest>
    : T extends `${infer Start}<$${infer Value}`
    ? Value
    : never

export type DeepReadonly<T> = {
  readonly [K in keyof T]: T[K] extends Record<string, any>
    ? DeepReadonly<T[K]>
    : T[K]
}

export type FormatTupleToNeverTuple<T> = T extends { length: 0 } ? never[] : T

export type ReadonlyArray<T extends any[]> = readonly [...T]

type SplitStrToArray<S extends string> = S extends ''
  ? []
  : S extends `${infer C}${infer R}`
  ? [C, ...SplitStrToArray<R>]
  : never

type TakeFirstNElements<
  T extends any[],
  N extends number,
  Result extends any[] = []
> = Result['length'] extends N
  ? Result
  : T extends [infer First, ...infer Rest]
  ? TakeFirstNElements<Rest, N, [...Result, First]>
  : Result

type JoinArrayOfStr<T extends string[]> = T extends []
  ? ''
  : T extends [infer Head, ...infer Tail]
  ? Head extends string
    ? `${Head}${JoinArrayOfStr<Tail extends string[] ? Tail : []>}`
    : never
  : never

type CutFirstCharsOfStr<
  S extends string,
  N extends number,
  SArray = TakeFirstNElements<SplitStrToArray<S>, N>
> = JoinArrayOfStr<SArray extends string[] ? SArray : never>

export type CutFirstCharsOfStrArray<T extends string[], N extends number> = {
  [K in keyof T]: T[K] extends string ? CutFirstCharsOfStr<T[K], N> : never
}

export type LowerCaseStrArray<T extends string[]> = {
  [K in keyof T]: T[K] extends string ? Lowercase<T[K]> : never
}

export type UpperCaseStrArray<T extends string[]> = {
  [K in keyof T]: T[K] extends string ? Uppercase<T[K]> : never
}

export type CapitalizeString<S extends string> =
  S extends `${infer First}${infer Rest}` ? `${Uppercase<First>}${Rest}` : S

export type CapitalizeStrArray<T extends string[]> = {
  [K in keyof T]: T[K] extends string ? CapitalizeString<T[K]> : never
}
