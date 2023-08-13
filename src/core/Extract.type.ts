import * as Type from './Schema.type'
import { FormatTupleToNeverTuple, MakeOptional, Prettify } from '../utils.type'
import {
  AdjustOptionalValue,
  OptionalValueToUndefined,
  SchemaConfig,
} from '../types'
import {
  SchemaArray,
  SchemaBoolean,
  SchemaNumber,
  SchemaObject,
  SchemaOr,
  SchemaString,
  SchemaTuple,
} from './Schema'

export type ExtractPrimitive<T extends Type.TypePrimitive> =
  AdjustOptionalValue<T, T['schema'][number]>

export type ExtractObject<T extends Type.TypeObject> = AdjustOptionalValue<
  T,
  Prettify<
    MakeOptional<{
      [K in keyof T['schema']]: OptionalValueToUndefined<T['schema'][K]>
    }>
  >
>

export type ExtractTuple<T extends Type.TypeTuple> = AdjustOptionalValue<
  T,
  Prettify<
    FormatTupleToNeverTuple<
      {
        [K in keyof T['schema'] as K extends `${number}`
          ? K
          : never]: ExtractSchema<T['schema'][K]>
      } & Pick<T['schema'], 'length'>
    >
  >
>

type ExtractArrayLike<T extends Type.TypeArray | Type.TypeOr> =
  AdjustOptionalValue<
    T,
    {
      [K in keyof T['schema'] as K extends `${number}`
        ? K
        : never]: ExtractSchema<T['schema'][K]>
    }
  >

export type ExtractOr<
  T extends Type.TypeOr,
  U = ExtractArrayLike<T>
> = AdjustOptionalValue<T, U[keyof U]>

export type ExtractArray<
  T extends Type.TypeArray,
  U = ExtractArrayLike<T>
> = AdjustOptionalValue<T, U[keyof U][]>

export type ExtractSchemaFromAny<T> = T extends Type.Types
  ? ExtractSchema<T>
  : never

export type ExtractSchema<T extends Type.Types> =
  // Primitive:
  T extends Type.TypePrimitive
    ? ExtractPrimitive<T>
    : // Tuple:
    T extends Type.TypeTuple
    ? ExtractTuple<T>
    : // Array:
    T extends Type.TypeArray
    ? ExtractArray<T>
    : // Or:
    T extends Type.TypeOr
    ? ExtractOr<T>
    : // Object:
    T extends Type.TypeObject
    ? ExtractObject<T>
    : // It's never gonna happen!
      never

export type InferClassFromSchema<T, TFormat, TConfig extends SchemaConfig> =
  // String:
  T extends Type.TypeString
    ? SchemaString<TFormat extends Type.InputString ? TFormat : never, TConfig>
    : // Tuple:
    T extends Type.TypeNumber
    ? SchemaNumber<TFormat extends Type.InputNumber ? TFormat : never, TConfig>
    : // Tuple:
    T extends Type.TypeBoolean
    ? SchemaBoolean<
        TFormat extends Type.InputBoolean ? TFormat : never,
        TConfig
      >
    : // Tuple:
    T extends Type.TypeTuple
    ? SchemaTuple<TFormat extends Type.InputTuple ? TFormat : never, TConfig>
    : // Array:
    T extends Type.TypeArray
    ? SchemaArray<TFormat extends Type.InputArray ? TFormat : never, TConfig>
    : // Or:
    T extends Type.TypeOr
    ? SchemaOr<TFormat extends Type.InputOr ? TFormat : never, TConfig>
    : // Object:
    T extends Type.TypeObject
    ? SchemaObject<TFormat extends Type.InputObject ? TFormat : never, TConfig>
    : // It's never gonna happen!
      never
