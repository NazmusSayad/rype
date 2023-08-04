import * as Type from './Type'
import * as TType from './Type-type'
import { MakeOptional, Mutable, PrettifyInput } from './utils-type'

export type ExtractPrimitiveType<T extends TType.Primitive> =
  T['schema'][number]

export type ExtractConstructor<T extends Type.TypeConstructor> = InstanceType<
  T['schema'][number]
>

export type ExtractArray<T extends Type.TypeArray> =
  (T['schema'] extends Type.TypeOr
    ? ExtractOr<T['schema']>
    : ExtractSchema<T['schema']>)[]

export type ExtractTuple<T extends Type.TypeTuple> = {
  [K in keyof T['schema']]: T['schema'][K] extends TType.Schema
    ? ExtractSchema<T['schema'][K]>
    : Mutable<T['schema'][K]>
}

export type ExtractOr<T extends Type.TypeOr> = {
  [K in keyof T['schema']]: T['schema'][K] extends TType.Schema
    ? ExtractSchema<T['schema'][K]>
    : Mutable<T['schema'][K]>
}[number]

export type ExtractObjectType<T extends TType.ObjectLike> = MakeOptional<{
  [K in keyof T]: T[K] extends Type.TypeBase
    ? T[K]['required'] extends true
      ? ExtractSchema<T[K]>
      : ExtractSchema<T[K]> | undefined
    : ExtractSchema<T[K]>
}>

export type ExtractSchema<T extends TType.Schema> = PrettifyInput<
  T extends TType.Primitive
    ? ExtractPrimitiveType<T>
    : T extends Type.TypeTuple
    ? ExtractTuple<T>
    : T extends Type.TypeArray
    ? ExtractArray<T>
    : T extends Type.TypeOr
    ? ExtractOr<T>
    : T extends TType.ObjectLike
    ? ExtractObjectType<T>
    : T extends Type.TypeConstructor
    ? ExtractConstructor<T>
    : never
>
