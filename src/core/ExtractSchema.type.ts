import * as Type from './Schema.type'
import { AdjustReadonlyObject, InferInput } from './Extract.type'
import { FormatTupleToNeverTuple, MakeOptional, Prettify } from '../utils.type'

export type ExtractPrimitive<T extends Type.TypePrimitive> = T['schema'][number]

export type ExtractObject<T extends Type.TypeObject> = AdjustReadonlyObject<
  T,
  Prettify<
    MakeOptional<{
      [K in keyof T['schema']]: InferInput<T['schema'][K]>
    }>
  >
>

export type ExtractTuple<T extends Type.TypeTuple> = AdjustReadonlyObject<
  T,
  Prettify<
    FormatTupleToNeverTuple<
      {
        [K in keyof T['schema'] as K extends `${number}`
          ? K
          : never]: InferInput<T['schema'][K]>
      } & Pick<T['schema'], 'length'>
    >
  >
>

type ExtractArrayLike<T extends Type.TypeArray | Type.TypeOr> = {
  [K in keyof T['schema'] as K extends `${number}` ? K : never]: InferInput<
    T['schema'][K]
  >
}

export type ExtractOr<
  T extends Type.TypeOr,
  U = ExtractArrayLike<T>
> = U[keyof U] extends never ? any : U[keyof U]

export type ExtractArray<
  T extends Type.TypeArray,
  U = ExtractArrayLike<T>
> = U[keyof U] extends never
  ? any[]
  : AdjustReadonlyObject<T, Prettify<U[keyof U][]>>
