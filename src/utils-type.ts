export type ValidObject = { [i: string]: any }
export type ValidConstructor = new (...args: any[]) => any

export type ConstArgs<T, TArray = any> = T extends readonly TArray[] ? T : never

export type Mutable<T> = {
  -readonly [K in keyof T]: T[K]
}
