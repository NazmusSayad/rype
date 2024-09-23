import * as Schema from './Schema'
import { SchemaConfig } from '@/config'

type AdjustSchemaInput<
  T extends Schema.TypeSchemaUnion,
  R
> = T['config']['isRequired'] extends true ? R : R | undefined

type AdjustSchemaOutput<
  T extends Schema.TypeSchemaUnion,
  R
> = T['config']['isRequired'] extends true
  ? R
  : 'defaultValue' extends keyof T['config']
  ? R
  : R | undefined

type ExtractSchemaCore<
  T extends Schema.TypeSchemaUnion,
  TMode extends 'input' | 'output'
> =
  // Primitive:
  T extends Schema.TypePrimitive
    ? Schema.ExtractPrimitive<T>
    : // Tuple:
    T extends Schema.SchemaTuple.Sample
    ? Schema.SchemaTuple.Extract<T, TMode>
    : // Array:
    T extends Schema.SchemaArray.Sample
    ? Schema.SchemaArray.Extract<T, TMode>
    : // Or:
    T extends Schema.SchemaOr.Sample
    ? Schema.SchemaOr.Extract<T, TMode>
    : // Instance:
    T extends Schema.SchemaInstance.Sample
    ? Schema.SchemaInstance.Extract<T>
    : // Object:
    T extends Schema.SchemaObject.Sample
    ? Schema.SchemaObject.Extract<T, TMode>
    : // Record:
    T extends Schema.SchemaRecord.Sample
    ? Schema.SchemaRecord.Extract<T, TMode> // Fixed:
    : T extends Schema.SchemaFixed.Sample
    ? Schema.SchemaFixed.Extract<T, TMode>
    : never

export type InferSchema<
  T,
  TMode extends 'input' | 'output'
> = TMode extends 'input' ? InferInput<T> : InferOutput<T>

export type InferInput<T> = T extends Schema.TypeSchemaUnion
  ? AdjustSchemaInput<T, ExtractSchemaCore<T, 'input'>>
  : never

export type InferOutput<T> = T extends Schema.TypeSchemaUnion
  ? AdjustSchemaOutput<T, ExtractSchemaCore<T, 'output'>>
  : never

export type InferClassFromSchema<T, TFormat, TConfig extends SchemaConfig> =
  // String:
  T extends Schema.SchemaString.Sample
    ? TFormat extends Schema.SchemaString.Input
      ? Schema.SchemaString<TFormat, TConfig>
      : never
    : // Number:
    T extends Schema.SchemaNumber.Sample
    ? TFormat extends Schema.SchemaNumber.Input
      ? Schema.SchemaNumber<TFormat, TConfig>
      : never
    : // Boolean:
    T extends Schema.SchemaBoolean.Sample
    ? TFormat extends Schema.SchemaBoolean.Input
      ? Schema.SchemaBoolean<TFormat, TConfig>
      : never
    : // Tuple:
    T extends Schema.SchemaTuple.Sample
    ? TFormat extends Schema.SchemaTuple.Input
      ? Schema.SchemaTuple<TFormat, TConfig>
      : never
    : // Array:
    T extends Schema.SchemaArray.Sample
    ? TFormat extends Schema.SchemaArray.Input
      ? Schema.SchemaArray<TFormat, TConfig>
      : never
    : // Or:
    T extends Schema.SchemaOr.Sample
    ? TFormat extends Schema.SchemaOr.Input
      ? Schema.SchemaOr<TFormat, TConfig>
      : never
    : // Object:
    T extends Schema.SchemaObject.Sample
    ? TFormat extends Schema.SchemaObject.Input
      ? Schema.SchemaObject<TFormat, TConfig>
      : never
    : // Instance:
    T extends Schema.SchemaInstance.Sample
    ? TFormat extends Schema.SchemaInstance.Input
      ? Schema.SchemaInstance<TFormat, TConfig>
      : never
    : // Record:
    T extends Schema.SchemaRecord.Sample
    ? TFormat extends Schema.SchemaRecord.Input
      ? Schema.SchemaRecord<TFormat, TConfig>
      : never
    : // Fixed:
    T extends Schema.SchemaFixed.Sample
    ? TFormat extends Schema.SchemaFixed.Input
      ? Schema.SchemaFixed<TFormat, TConfig>
      : never
    : // It's never gonna happen!
      never
