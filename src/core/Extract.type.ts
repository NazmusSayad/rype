import * as Schema from './Schema.type'
import { FormatTupleToNeverTuple, MakeOptional, Prettify } from '../utils.type'

export type ExtractPrimitive<T extends Schema.TypePrimitive> = T['args'][number]

export type ExtractObject<T extends Schema.TypeObject> = Prettify<
  MakeOptional<{
    [K in keyof T['args']]: T['args'][K]['isRequired'] extends false
      ? ExtractSchema<T['args'][K]> | undefined
      : ExtractSchema<T['args'][K]>
  }>
>

export type ExtractTuple<T extends Schema.TypeTuple> = Prettify<
  FormatTupleToNeverTuple<
    {
      [K in keyof T['args'] as K extends `${number}`
        ? K
        : never]: ExtractSchema<T['args'][K]>
    } & Pick<T['args'], 'length'>
  >
>

type ExtractArrayLike<T extends Schema.TypeArray | Schema.TypeOr> = {
  [K in keyof T['args'] as K extends `${number}` ? K : never]: ExtractSchema<
    T['args'][K]
  >
}

export type ExtractOr<
  T extends Schema.TypeOr,
  U = ExtractArrayLike<T>
> = U[keyof U]

export type ExtractArray<
  T extends Schema.TypeArray,
  U = ExtractArrayLike<T>
> = U[keyof U][]

export type ExtractSchema<T extends Schema.Types> =
  // Primitive:
  T extends Schema.TypePrimitive
    ? ExtractPrimitive<T>
    : // Tuple:
    T extends Schema.TypeTuple
    ? ExtractTuple<T>
    : // Array:
    T extends Schema.TypeArray
    ? ExtractArray<T>
    : // Or:
    T extends Schema.TypeOr
    ? ExtractOr<T>
    : // Object:
    T extends Schema.TypeObject
    ? ExtractObject<T>
    : // It's never gonna happen!
      never
