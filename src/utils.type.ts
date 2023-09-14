export type ValidObject = { [i: string]: unknown }
export type ValidConstructor = new (...args: any[]) => any

export type DeepOptional<T> =
  | undefined
  | {
      [Key in keyof T]: DeepOptional<T[Key]>
    }

export type Prettify<T> = {
  [Key in keyof T]: T[Key]
} & {}

export type Mutable<T> = {
  -readonly [K in keyof T]: T[K]
}

export type ObjectMerge<T extends object, U extends object> = Prettify<
  Omit<T, keyof U> & U
>

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

export type ArrayOfStrToObjectAsKey<T extends readonly string[]> = {
  [K in T[number]]: string
}

export type SplitStringBySpace<S extends string> = S extends ''
  ? []
  : S extends `${infer First} ${infer Rest}`
  ? [First, ...SplitStringBySpace<Rest>]
  : [S]

export type DeepReadonly<T> = {
  readonly [K in keyof T]: T[K] extends Record<string, any>
    ? DeepReadonly<T[K]>
    : T[K]
}

export type ReadonlyArray<T extends any[]> = readonly [...T]
export type FormatTupleToNeverTuple<T> = T extends { length: 0 } ? never[] : T

export type CapitalizeString<S extends string> =
  S extends `${infer First}${infer Rest}` ? `${Uppercase<First>}${Rest}` : S

export type CapitalizeStrArray<T extends string[]> = {
  [K in keyof T]: T[K] extends string ? CapitalizeString<T[K]> : never
}

export type LowerCaseStrArray<T extends string[]> = {
  [K in keyof T]: T[K] extends string ? Lowercase<T[K]> : never
}

export type UpperCaseStrArray<T extends string[]> = {
  [K in keyof T]: T[K] extends string ? Uppercase<T[K]> : never
}
