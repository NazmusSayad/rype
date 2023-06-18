import * as Type from './Type'
import * as TType from './Type-type'
import { Mutable } from './utils-type'

export type ExtractPrimitiveType<T extends TType.Primitive> = T['args'][number]

export type ExtractConstructor<T extends Type.TypeConstructor> = InstanceType<
  T['args'][number]
>

export type ExtractArray<T extends TType.ArrayLike> = {
  [K in keyof T['args']]: T['args'][K] extends TType.Schema
    ? LTypeExtract<T['args'][K]>
    : Mutable<T['args'][K]>
}

export type ExtractAny<T extends Type.TypeOr> = {
  [K in keyof T['args']]: T['args'][K] extends TType.Schema
    ? LTypeExtract<T['args'][K]>
    : Mutable<T['args'][K]>
}[number]

export type ExtractObjectType<T extends TType.ObjectLike> = {
  [K in keyof T as T extends TType.ObjectLike
    ? K
    : T[K]['required'] extends true
    ? K
    : never]: LTypeExtract<T[K]>
} & {
  [K in keyof T as T extends TType.ObjectLike
    ? K
    : T[K]['required'] extends false
    ? K
    : never]?: LTypeExtract<T[K]>
}

export type LTypeExtract<T extends TType.Schema> = T extends TType.Primitive
  ? ExtractPrimitiveType<T>
  : T extends TType.ArrayLike
  ? ExtractArray<T>
  : T extends Type.TypeOr
  ? ExtractAny<T>
  : T extends TType.ObjectLike
  ? ExtractObjectType<T>
  : T extends Type.TypeConstructor
  ? ExtractConstructor<T>
  : never
