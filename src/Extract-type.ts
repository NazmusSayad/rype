import * as LT from './LType'
import { Mutable } from './utils-type'

export type ExtractPrimitiveType<T extends LT.Primitive> = T['args'][number]

type ExtractConstructor<T extends LT.TypeConstructor> = InstanceType<
  T['args'][number]
>

type ExtractArray<T extends LT.Array> = {
  [K in keyof T['args']]: T['args'][K] extends LT.Schema
    ? LTypeExtract<T['args'][K]>
    : Mutable<T['args'][K]>
}

type ExtractAny<T extends LT.TypeAny> = {
  [K in keyof T['args']]: T['args'][K] extends LT.Schema
    ? LTypeExtract<T['args'][K]>
    : Mutable<T['args'][K]>
}[number]

type ExtractObjectType<T extends LT.Object> = {
  [K in keyof T as T extends LT.Object
    ? K
    : T[K]['required'] extends true
    ? K
    : never]: LTypeExtract<T[K]>
} & {
  [K in keyof T as T extends LT.Object
    ? K
    : T[K]['required'] extends false
    ? K
    : never]?: LTypeExtract<T[K]>
}

export type LTypeExtract<T extends LT.Schema> = T extends LT.Primitive
  ? ExtractPrimitiveType<T>
  : T extends LT.Array
  ? ExtractArray<T>
  : T extends LT.TypeAny
  ? ExtractAny<T>
  : T extends LT.Object
  ? ExtractObjectType<T>
  : T extends LT.TypeConstructor
  ? ExtractConstructor<T>
  : never
