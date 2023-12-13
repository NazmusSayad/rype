import * as Schema from './Schema'
import { SchemaConfig } from '../config'

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
    T extends Schema.TypeTuple
    ? Schema.ExtractTuple<T, TMode>
    : // Array:
    T extends Schema.TypeArray
    ? Schema.ExtractArray<T, TMode>
    : // Or:
    T extends Schema.TypeOr
    ? Schema.ExtractOr<T, TMode>
    : // Instance:
    T extends Schema.TypeInstance
    ? Schema.ExtractInstance<T>
    : // Object:
    T extends Schema.TypeObject
    ? Schema.ExtractObject<T, TMode>
    : // Record:
    T extends Schema.TypeRecord
    ? Schema.ExtractRecord<T, TMode> // Fixed:
    : T extends Schema.TypeFixed
    ? Schema.ExtractFixed<T, TMode>
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
  T extends Schema.TypeString
    ? TFormat extends Schema.InputString
      ? Schema.SchemaString<TFormat, TConfig>
      : never
    : // Number:
    T extends Schema.TypeNumber
    ? TFormat extends Schema.InputNumber
      ? Schema.SchemaNumber<TFormat, TConfig>
      : never
    : // Boolean:
    T extends Schema.TypeBoolean
    ? TFormat extends Schema.InputBoolean
      ? Schema.SchemaBoolean<TFormat, TConfig>
      : never
    : // Tuple:
    T extends Schema.TypeTuple
    ? TFormat extends Schema.InputTuple
      ? Schema.SchemaTuple<TFormat, TConfig>
      : never
    : // Array:
    T extends Schema.TypeArray
    ? TFormat extends Schema.InputArray
      ? Schema.SchemaArray<TFormat, TConfig>
      : never
    : // Or:
    T extends Schema.TypeOr
    ? TFormat extends Schema.InputOr
      ? Schema.SchemaOr<TFormat, TConfig>
      : never
    : // Object:
    T extends Schema.TypeObject
    ? TFormat extends Schema.InputObject
      ? Schema.SchemaObject<TFormat, TConfig>
      : never
    : // Instance:
    T extends Schema.TypeInstance
    ? TFormat extends Schema.InputInstance
      ? Schema.SchemaInstance<TFormat, TConfig>
      : never
    : // Record:
    T extends Schema.TypeRecord
    ? TFormat extends Schema.InputRecord
      ? Schema.SchemaRecord<TFormat, TConfig>
      : never
    : // Fixed:
    T extends Schema.TypeFixed
    ? TFormat extends Schema.InputFixed
      ? Schema.SchemaFixed<TFormat, TConfig>
      : never
    : // It's never gonna happen!
      never
