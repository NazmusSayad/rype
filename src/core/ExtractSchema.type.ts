import * as Type from './Schema.type'
import { FormatTupleToNeverTuple, MakeOptional, Prettify } from '../utils.type'
import { ExtractSchema } from './Extract.type'

export type ExtractPrimitive<T extends Type.TypePrimitive> = T['schema'][number]

export type ExtractObject<
  T extends Type.TypeObject,
  TMode extends 'input' | 'output'
> = Prettify<
  MakeOptional<{
    [K in keyof T['schema']]: ExtractSchema<T['schema'][K], TMode>
  }>
>

export type ExtractTuple<
  T extends Type.TypeTuple,
  TMode extends 'input' | 'output'
> = Prettify<
  FormatTupleToNeverTuple<
    {
      [K in keyof T['schema'] as K extends `${number}`
        ? K
        : never]: ExtractSchema<T['schema'][K], TMode>
    } & Pick<T['schema'], 'length'>
  >
>

type ExtractArrayLike<
  T extends Type.TypeArray | Type.TypeOr,
  TMode extends 'input' | 'output'
> = {
  [K in keyof T['schema'] as K extends `${number}` ? K : never]: ExtractSchema<
    T['schema'][K],
    TMode
  >
}

export type ExtractOr<
  T extends Type.TypeOr,
  TMode extends 'input' | 'output',
  U = ExtractArrayLike<T, TMode>
> = U[keyof U]

export type ExtractArray<
  T extends Type.TypeArray,
  TMode extends 'input' | 'output',
  U = ExtractArrayLike<T, TMode>
> = U[keyof U] extends never ? any[] : Prettify<U[keyof U][]>
