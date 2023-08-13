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

export type FormatTupleToNeverTuple<T> = T extends { length: 0 } ? never[] : T

export type ReadonlyArray<T extends any[]> = readonly [...T]
