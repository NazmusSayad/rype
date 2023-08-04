export type ValidObject = { [i: string]: any }
export type ValidConstructor = new (...args: any[]) => any

export type ConstArgs<T, TArray = any> = T extends readonly TArray[] ? T : never

export type Mutable<T> = {
  -readonly [K in keyof T]: T[K]
}

export type HasUndefined<T> = (T extends undefined ? true : false) extends false
  ? false
  : true

export type Prettify<T extends object> = {
  [Key in keyof T]: T[Key]
} & {}

export type MakeOptional<TObject> = {
  [K in keyof TObject as HasUndefined<TObject[K]> extends true
    ? never
    : K]: TObject[K]
} & {
  [K in keyof TObject as HasUndefined<TObject[K]> extends false
    ? never
    : K]?: TObject[K]
}

export type ExtractPlaceholderValues<T extends string> =
  T extends `${infer Start}<$${infer Value}$>${infer Rest}`
    ? Value | ExtractPlaceholderValues<Rest>
    : T extends `${infer Start}<$${infer Value}`
    ? Value
    : never
