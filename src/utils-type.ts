export type ValidObject = { [i: string]: any }

export type ConstArgs<T, TArray = any> = T extends readonly TArray[] ? T : never

export type Mutable<T> = {
  -readonly [K in keyof T]: T[K]
}

export type DeepMutable<T> = {
  -readonly [K in keyof T]: T[K] extends object ? DeepMutable<T[K]> : T[K]
}

export type MutableTuple<T extends readonly any[]> = {
  -readonly [K in keyof T]: T[K]
}

export type SuffixedKeys<T, S extends string> = {
  [K in keyof T as `${string & K}${S}`]: T[K]
}
