import {
  SchemaOr,
  SchemaTuple,
  SchemaArray,
  SchemaString,
  SchemaNumber,
  SchemaObject,
  SchemaBoolean,
  SchemaRecord,
  SchemaInstance,
} from './Schema'
import {
  ExtractOr,
  ExtractArray,
  ExtractTuple,
  ExtractObject,
  ExtractPrimitive,
  ExtractRecord,
  ExtractInstance,
} from './ExtractSchema.type'
import * as Type from './Schema.type'
import { SchemaConfig } from '../types'
import { DeepReadonly } from '../utils.type'

export type AdjustReadonlyObject<
  T extends Type.Types,
  R
> = T['config']['convertToReadonly'] extends true ? DeepReadonly<R> : R

type AdjustSchemaInput<
  T extends Type.Types,
  R
> = T['config']['isRequired'] extends true ? R : R | undefined

type AdjustSchemaOutput<
  T extends Type.Types,
  R
> = T['config']['isRequired'] extends true
  ? R
  : 'defaultValue' extends keyof T['config']
  ? R
  : R | undefined

type ExtractSchemaCore<T extends Type.Types, TMode extends 'input' | 'output'> =
  // Primitive:
  T extends Type.TypePrimitive
    ? ExtractPrimitive<T>
    : // Tuple:
    T extends Type.TypeTuple
    ? ExtractTuple<T, TMode>
    : // Array:
    T extends Type.TypeArray
    ? ExtractArray<T, TMode>
    : // Or:
    T extends Type.TypeOr
    ? ExtractOr<T, TMode>
    : // Instance:
    T extends Type.TypeInstance
    ? ExtractInstance<T>
    : // Object:
    T extends Type.TypeObject
    ? ExtractObject<T, TMode>
    : // Record:
    T extends Type.TypeRecord
    ? ExtractRecord<T, TMode>
    : // It's never gonna happen!
      never

export type InferInput<T> = T extends Type.Types
  ? AdjustSchemaInput<T, ExtractSchemaCore<T, 'input'>>
  : never

export type InferOutput<T> = T extends Type.Types
  ? AdjustSchemaOutput<T, ExtractSchemaCore<T, 'output'>>
  : never

export type InferSchema<
  T,
  TMode extends 'input' | 'output'
> = TMode extends 'input' ? InferInput<T> : InferOutput<T>

export type InferClassFromSchema<T, TFormat, TConfig extends SchemaConfig> =
  // String:
  T extends Type.TypeString
    ? TFormat extends Type.InputString
      ? SchemaString<TFormat, TConfig>
      : never
    : // Number:
    T extends Type.TypeNumber
    ? TFormat extends Type.InputNumber
      ? SchemaNumber<TFormat, TConfig>
      : never
    : // Boolean:
    T extends Type.TypeBoolean
    ? TFormat extends Type.InputBoolean
      ? SchemaBoolean<TFormat, TConfig>
      : never
    : // Tuple:
    T extends Type.TypeTuple
    ? TFormat extends Type.InputTuple
      ? SchemaTuple<TFormat, TConfig>
      : never
    : // Array:
    T extends Type.TypeArray
    ? TFormat extends Type.InputArray
      ? SchemaArray<TFormat, TConfig>
      : never
    : // Or:
    T extends Type.TypeOr
    ? TFormat extends Type.InputOr
      ? SchemaOr<TFormat, TConfig>
      : never
    : // Object:
    T extends Type.TypeObject
    ? TFormat extends Type.InputObject
      ? SchemaObject<TFormat, TConfig>
      : never
    : // Object:
    T extends Type.TypeInstance
    ? TFormat extends Type.InputInstance
      ? SchemaInstance<TFormat, TConfig>
      : never
    : // Object:
    T extends Type.TypeRecord
    ? TFormat extends Type.InputRecord
      ? SchemaRecord<TFormat, TConfig>
      : never
    : // It's never gonna happen!
      never
